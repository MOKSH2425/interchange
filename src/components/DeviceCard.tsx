import type { Device, MatchResult } from '../types/device';

interface Props {
  device: Device;
  matches: MatchResult;
  onRemove?: (id: string) => void;
}

export function DeviceCard({ device, matches, onRemove }: Props) {
  const isSeed = device.id.startsWith('seed_');
  const hasDimensions = !!(device.heightMm && device.widthMm && device.radiusMm);

  return (
    <div className="bg-paper-raised border border-line rounded-[10px] p-4 mb-3.5">
      <div className="flex justify-between items-start gap-2.5">
        <div>
          <div className="text-[11.5px] text-ink-soft uppercase tracking-wide">Device</div>
          <h2 className="text-lg font-display font-semibold m-0 -mt-0.5 tracking-tight">
            {device.name}
          </h2>
        </div>
        {!isSeed && onRemove && (
          <button
            className="text-[#B7BEC6] active:text-danger text-xs font-mono bg-transparent border-none cursor-pointer p-1"
            onClick={() => onRemove(device.id)}
          >
            Remove
          </button>
        )}
      </div>

      {hasDimensions && (
        <div className="grid grid-cols-2 gap-2 mt-3.5">
          <Spec
            label="Panel H × W · radius"
            value={`${device.heightMm} × ${device.widthMm}mm · r${device.radiusMm}`}
          />
        </div>
      )}

      {/* --- Screen Guard Finder --- */}
      <div className={hasDimensions ? 'mt-5 pt-4 border-t border-line-soft' : 'mt-1'}>
        <div className="text-[13px] font-display font-semibold tracking-tight">
          Screen Guard Finder
        </div>
      </div>

      <SectionLabel
        dotColor="bg-teal"
        label={`Original Drawing — same screen & cutout (${matches.originalDrawing.length})`}
      />
      <MatchList
        items={matches.originalDrawing}
        dotColor="bg-teal"
        empty={
          device.screenModel
            ? 'No other device shares this exact screen model & cutout yet.'
            : 'No screen model on file for this device yet.'
        }
      />

      <SectionLabel
        dotColor="bg-violet"
        label={`Full Temper — identical H × W × radius (${matches.fullTemper.length})`}
      />
      <MatchList
        items={matches.fullTemper}
        dotColor="bg-violet"
        empty={
          hasDimensions
            ? 'No other device has the exact same panel dimensions yet.'
            : 'No panel dimensions on file — add height, width & radius for a Full Temper match.'
        }
        renderNote={(m) => `${m.heightMm} × ${m.widthMm}mm · r${m.radiusMm}`}
      />

      {/* --- Cases --- */}
      <div className="mt-5 pt-4 border-t border-line-soft">
        <div className="text-[13px] font-display font-semibold tracking-tight">
          Phone Cases &amp; Base Models
        </div>
      </div>
      <SectionLabel
        dotColor="bg-amber"
        label={`Same base model (${matches.baseModel.length})`}
      />
      <MatchList
        items={matches.baseModel}
        dotColor="bg-amber"
        empty={
          device.baseModel
            ? 'No other device shares this base model yet.'
            : 'No base model on file — link it to a device with the same chassis so cases match.'
        }
      />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper border border-line-soft rounded-lg px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wide text-ink-soft mb-0.5">{label}</div>
      <div className="font-mono text-[13.5px] font-medium">{value}</div>
    </div>
  );
}

function SectionLabel({ dotColor, label }: { dotColor: string; label: string }) {
  return (
    <div className="text-[11px] uppercase tracking-wider text-ink-soft mt-4 mb-2 flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </div>
  );
}

function MatchList({
  items,
  dotColor,
  empty,
  renderNote,
}: {
  items: Device[];
  dotColor: string;
  empty: string;
  renderNote?: (d: Device) => string;
}) {
  return (
    <div className="bg-paper-raised border border-line rounded-[10px] p-2.5 max-h-[280px] overflow-y-auto">
      {items.length === 0 ? (
        <div className="text-[13px] text-ink-soft italic px-1 py-2">{empty}</div>
      ) : (
        items.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-2.5 py-2.5 px-1 border-b border-line-soft last:border-none"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
            <div className="text-sm font-medium flex-1">{m.name}</div>
            {renderNote && <div className="font-mono text-[11.5px] text-ink-soft">{renderNote(m)}</div>}
          </div>
        ))
      )}
    </div>
  );
}
