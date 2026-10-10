import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { AppContext } from '../App';
import type { Device } from '../types/device';

type Mode = 'screen' | 'case';

interface Group {
  code: string;
  members: Device[];
}

function buildGroups(devices: Device[], field: 'screenModel' | 'baseModel'): Group[] {
  const map = new Map<string, Device[]>();
  for (const d of devices) {
    const code = d[field];
    if (!code) continue;
    if (!map.has(code)) map.set(code, []);
    map.get(code)!.push(d);
  }
  return Array.from(map.entries())
    .map(([code, members]) => ({
      code,
      members: [...members].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.members.length - a.members.length);
}

export function GroupsPage() {
  const { devices } = useOutletContext<AppContext>();
  const [mode, setMode] = useState<Mode>('screen');
  const [query, setQuery] = useState('');

  const screenGroups = useMemo(() => buildGroups(devices, 'screenModel'), [devices]);
  const caseGroups = useMemo(() => buildGroups(devices, 'baseModel'), [devices]);

  const groups = mode === 'screen' ? screenGroups : caseGroups;
  const devicesInGroups = groups.reduce((sum, g) => sum + g.members.length, 0);
  const ungrouped = devices.length - devicesInGroups;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.members.some((m) => m.name.toLowerCase().includes(q)));
  }, [groups, query]);

  const shown = filtered.slice(0, 100);

  return (
    <main className="px-[18px]">
      <div className="text-xl font-display font-bold mt-4 mb-1 tracking-tight">Groups</div>
      <div className="text-[13px] text-ink-soft mb-4 leading-relaxed">
        Every confirmed interchange group in your database — search results are built from
        these. Tap a group to see its full member list.
      </div>

      <div className="flex gap-1.5 mb-3">
        <ModeChip
          active={mode === 'screen'}
          label={`Screen Guard (${screenGroups.length})`}
          onClick={() => setMode('screen')}
        />
        <ModeChip
          active={mode === 'case'}
          label={`Cases (${caseGroups.length})`}
          onClick={() => setMode('case')}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <Stat n={groups.length} label="groups" />
        <Stat n={devicesInGroups} label="devices covered" />
        <Stat n={ungrouped} label="not yet grouped" />
      </div>

      <div className="bg-paper-raised border border-line rounded-[10px] flex items-center gap-2.5 px-3.5 py-3 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D2B3A" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          className="border-none outline-none bg-transparent font-mono text-[15px] w-full"
          placeholder="Find a group containing..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      {mode === 'case' && ungrouped > 0 && (
        <div className="text-[12px] text-ink-soft bg-paper-raised border border-line-soft rounded-lg px-3 py-2.5 mb-3 leading-relaxed">
          {ungrouped} devices don't have a confirmed case group yet. This list only shows
          real, sourced pairings — it grows as fits get confirmed via{' '}
          <span className="font-medium text-ink">Add device</span>.
        </div>
      )}

      {shown.length === 0 ? (
        <div className="text-center py-10 text-ink-soft text-sm">
          No group matches "{query}".
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map((g) => (
            <GroupCard key={g.code} group={g} accent={mode === 'screen' ? 'bg-teal' : 'bg-amber'} />
          ))}
        </div>
      )}

      {filtered.length > 100 && (
        <div className="text-[12px] text-ink-soft font-mono text-center py-3">
          +{filtered.length - 100} more groups — narrow with search above
        </div>
      )}
    </main>
  );
}

function ModeChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`text-[13px] font-medium px-3 py-1.5 rounded-full border ${
        active ? 'bg-ink text-paper border-ink' : 'bg-paper-raised text-ink-soft border-line'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="bg-paper-raised border border-line rounded-lg py-2 text-center">
      <div className="font-display font-bold text-lg leading-none">{n}</div>
      <div className="text-[10px] text-ink-soft uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function GroupCard({ group, accent }: { group: Group; accent: string }) {
  const preview = group.members.slice(0, 3).map((m) => m.name);
  const remaining = group.members.length - preview.length;

  return (
    <details className="bg-paper-raised border border-line rounded-[10px] overflow-hidden group">
      <summary className="px-3.5 py-3 cursor-pointer list-none flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full shrink-0 ${accent}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {preview.join(', ')}
            {remaining > 0 && <span className="text-ink-soft"> +{remaining} more</span>}
          </div>
          <div className="text-[11px] text-ink-soft font-mono mt-0.5">
            {group.members.length} devices · {group.code}
          </div>
        </div>
        <svg
          className="shrink-0 transition-transform group-open:rotate-180"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4A5A6B"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="border-t border-line-soft px-3.5 py-2.5">
        {group.members.map((m) => (
          <div key={m.id} className="text-sm py-1.5 border-b border-line-soft last:border-none">
            {m.name}
          </div>
        ))}
      </div>
    </details>
  );
}
