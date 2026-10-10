import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { brandOf } from '../hooks/useDevices';
import type { AppContext } from '../App';

export function BrowsePage() {
  const { devices, stats, removeDevice } = useOutletContext<AppContext>();
  const [brandFilter, setBrandFilter] = useState('');
  const [filterText, setFilterText] = useState('');

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    devices.forEach((d) => {
      const b = brandOf(d.name);
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [devices]);

  const filtered = useMemo(() => {
    let list = devices;
    if (brandFilter) list = list.filter((d) => brandOf(d.name) === brandFilter);
    const q = filterText.trim().toLowerCase();
    if (q) list = list.filter((d) => d.name.toLowerCase().includes(q));
    return [...list].reverse();
  }, [devices, brandFilter, filterText]);

  const shown = filtered.slice(0, 200);

  return (
    <main className="px-[18px]">
      <div className="text-xl font-display font-bold mt-4 mb-1 tracking-tight">Database</div>
      <div className="text-[13px] text-ink-soft mb-4 leading-relaxed">
        {stats.total} devices &bull; {stats.withScreenModel} with screen model &bull;{' '}
        {stats.withDimensions} with panel dimensions &bull; {stats.withBaseModel} with base
        model
      </div>

      <div className="flex gap-1.5 mb-2.5 overflow-x-auto pb-0.5">
        <FilterChip active={brandFilter === ''} label="All" onClick={() => setBrandFilter('')} />
        {brandCounts.map(([b, c]) => (
          <FilterChip
            key={b}
            active={brandFilter === b}
            label={`${b} (${c})`}
            onClick={() => setBrandFilter(b)}
          />
        ))}
      </div>

      <div className="bg-paper-raised border border-line rounded-[10px] flex items-center gap-2.5 px-3.5 py-3 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D2B3A" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          className="border-none outline-none bg-transparent font-mono text-[15px] w-full"
          placeholder="Filter by name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        {shown.length === 0 ? (
          <div className="px-3.5 py-3 text-ink-soft text-sm">No devices match this filter.</div>
        ) : (
          shown.map((d) => (
            <div
              key={d.id}
              className="px-3.5 py-3 border-b border-line-soft last:border-none flex justify-between items-center gap-2.5"
            >
              <div>
                <div className="text-sm font-medium">{d.name}</div>
                <div className="text-[11.5px] text-ink-soft font-mono mt-0.5">
                  {d.screenModel ? `screen: ${d.screenModel}` : 'no screen group'}
                  {d.baseModel ? ` · case: ${d.baseModel}` : ''}
                  {d.heightMm && d.widthMm && d.radiusMm
                    ? ` · ${d.heightMm}×${d.widthMm}mm r${d.radiusMm}`
                    : ''}
                </div>
              </div>
              {!d.id.startsWith('seed_') && (
                <button
                  className="text-[#B7BEC6] active:text-danger text-xs font-mono bg-transparent border-none cursor-pointer p-1"
                  onClick={() => removeDevice(d.id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
        {filtered.length > 200 && (
          <div className="px-3.5 py-3 text-[11.5px] text-ink-soft font-mono">
            +{filtered.length - 200} more — narrow with search above
          </div>
        )}
      </div>
    </main>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`whitespace-nowrap text-[12.5px] font-medium px-3 py-1.5 rounded-full border ${
        active ? 'bg-ink text-paper border-ink' : 'bg-paper-raised text-ink-soft border-line'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
