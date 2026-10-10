import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { DeviceCard } from '../components/DeviceCard';
import { brandOf } from '../hooks/useDevices';
import type { Device } from '../types/device';
import type { AppContext } from '../App';

export function SearchPage() {
  const {
    devices,
    findMatches,
    removeDevice,
    favorites,
    isFavorite,
    toggleFavorite,
    settings,
    updateSettings,
  } = useOutletContext<AppContext>();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hints = useMemo(() => {
    const seen = new Set<string>();
    const picks: string[] = [];
    for (const d of devices) {
      const b = brandOf(d.name);
      if (!seen.has(b) && picks.length < 5) {
        seen.add(b);
        picks.push(d.name);
      }
    }
    return picks;
  }, [devices]);

  const matches = useMemo(() => {
    let source = devices;
    if (showFavoritesOnly) {
      source = devices.filter((d) => favorites.includes(d.id));
    }

    const q = query.trim().toLowerCase();
    if (!q) return showFavoritesOnly ? source : [];

    const tokens = q.split(/\s+/).filter(Boolean);

    return source
      .filter((d) => {
        const nameLower = d.name.toLowerCase();
        const screenLower = d.screenModel.toLowerCase();
        const baseLower = d.baseModel.toLowerCase();
        // Check if all query tokens match name, screen model, or base model
        return tokens.every(
          (t) => nameLower.includes(t) || screenLower.includes(t) || baseLower.includes(t)
        );
      })
      .slice(0, 30);
  }, [devices, favorites, query, showFavoritesOnly]);

  return (
    <div>
      <div className="p-[18px]">
        <div className="bg-paper-raised border-[1.5px] border-ink rounded-[10px] flex items-center gap-2 px-3.5 py-3 shadow-[3px_3px_0_var(--color-ink)] relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink shrink-0">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            className="border-none outline-none bg-transparent font-mono text-[15.5px] w-full text-ink placeholder:text-ink-soft"
            placeholder="Type a device, e.g. Redmi Note 10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono px-2 py-0.5 rounded-full bg-paper border border-line text-ink-soft hover:text-ink cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap mt-2.5 items-center">
          {favorites.length > 0 && (
            <button
              className={`text-xs font-mono px-2.5 py-1.5 rounded-full border cursor-pointer transition-colors ${
                showFavoritesOnly
                  ? 'bg-amber text-slate-950 border-amber font-bold'
                  : 'bg-paper-raised border-line text-ink-soft hover:border-amber'
              }`}
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
            >
              ★ Favorites ({favorites.length})
            </button>
          )}

          {hints.map((h) => (
            <button
              key={h}
              className="text-xs font-mono bg-paper-raised border border-line px-2.5 py-1.5 rounded-full text-ink-soft active:bg-amber-soft active:border-amber cursor-pointer"
              onClick={() => {
                setQuery(h);
                setShowFavoritesOnly(false);
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <main className="px-[18px]">
        {query.trim() === '' && !showFavoritesOnly ? (
          <EmptyState
            title="Search a device to start"
            body="Type any phone model to see which other devices share its exact screen model & cutout, panel dimensions, or case."
          />
        ) : matches.length === 0 ? (
          <EmptyState
            title={showFavoritesOnly ? 'No favorite devices yet' : 'No device found'}
            body={
              showFavoritesOnly
                ? 'Tap the ☆ icon on any device card to pin it to your favorites for fast access.'
                : `"${query}" isn't in your database yet. Add it from the Add device tab.`
            }
          />
        ) : (
          <>
            <div className="flex justify-between items-center my-3 text-[12.5px] font-mono text-ink-soft">
              <div>
                {matches.length} match{matches.length > 1 ? 'es' : ''}
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <span>Tolerance:</span>
                <button
                  onClick={() => {
                    const nextTol = settings.toleranceMm >= 2 ? 0 : settings.toleranceMm + 0.5;
                    updateSettings({ toleranceMm: nextTol });
                  }}
                  className="px-1.5 py-0.5 rounded bg-paper border border-line text-amber font-bold cursor-pointer"
                >
                  {settings.toleranceMm > 0 ? `±${settings.toleranceMm}mm` : 'Exact'}
                </button>
              </div>
            </div>

            {matches.map((d: Device) => (
              <DeviceCard
                key={d.id}
                device={d}
                matches={findMatches(d)}
                onRemove={removeDevice}
                isFavorite={isFavorite(d.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="text-center py-10 px-5 text-ink-soft">
      <svg
        className="mx-auto mb-2.5 opacity-35"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <h3 className="text-ink text-base m-0 mb-1.5 font-display font-semibold">{title}</h3>
      <p className="text-[13.5px] leading-relaxed mx-auto max-w-[280px]">{body}</p>
    </div>
  );
}

