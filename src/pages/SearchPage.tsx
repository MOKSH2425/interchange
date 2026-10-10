import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { DeviceCard } from '../components/DeviceCard';
import { brandOf } from '../hooks/useDevices';
import type { Device } from '../types/device';
import type { AppContext } from '../App';

export function SearchPage() {
  const { devices, findMatches, removeDevice } = useOutletContext<AppContext>();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

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
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return devices.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 25);
  }, [devices, query]);

  return (
    <div>
      <div className="p-[18px]">
        <div className="bg-paper-raised border-[1.5px] border-ink rounded-[10px] flex items-center gap-2.5 px-3.5 py-3 shadow-[3px_3px_0_var(--color-ink)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D2B3A" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            className="border-none outline-none bg-transparent font-mono text-[15.5px] w-full text-ink placeholder:text-[#9AA5B0]"
            placeholder="Type a device, e.g. Redmi Note 10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap mt-2.5">
          {hints.map((h) => (
            <button
              key={h}
              className="text-xs font-mono bg-paper-raised border border-line px-2.5 py-1.5 rounded-full text-ink-soft active:bg-amber-soft active:border-amber"
              onClick={() => setQuery(h)}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <main className="px-[18px]">
        {query.trim() === '' ? (
          <EmptyState
            title="Search a device to start"
            body="Type any phone model to see which other devices share its exact screen model & cutout, panel dimensions, or case."
          />
        ) : matches.length === 0 ? (
          <EmptyState
            title="No device found"
            body={`"${query}" isn't in your database yet. Add it from the Add device tab.`}
          />
        ) : (
          <>
            <div className="text-[12.5px] text-ink-soft my-4 font-mono">
              {matches.length} match{matches.length > 1 ? 'es' : ''}
            </div>
            {matches.map((d: Device) => (
              <DeviceCard key={d.id} device={d} matches={findMatches(d)} onRemove={removeDevice} />
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
        stroke="#1D2B3A"
        strokeWidth="1.5"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <h3 className="text-ink text-base m-0 mb-1.5">{title}</h3>
      <p className="text-[13.5px] leading-relaxed mx-auto max-w-[280px]">{body}</p>
    </div>
  );
}
