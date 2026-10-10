import type { Device, MatchResult } from '../types/device';

interface Props {
  device: Device;
  matches: MatchResult;
  onClose: () => void;
}

export function PrintableLabelModal({ device, matches, onClose }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const screenMatchesStr =
    matches.originalDrawing.map((m) => m.name).join(', ') || 'No direct cutout match on file';
  const caseMatchesStr = matches.baseModel.map((m) => m.name).join(', ') || 'No direct case match on file';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-paper-raised border border-line rounded-xl max-w-[440px] w-full p-5 shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center pb-3 border-b border-line mb-4 no-print">
          <div className="text-base font-display font-bold text-ink">Shop Shelf & Stock Label</div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink font-mono text-sm px-2 py-1 rounded bg-paper border border-line cursor-pointer"
          >
            Close ✕
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="printable-card-modal bg-white text-slate-900 border-2 border-slate-900 rounded-lg p-4 font-sans text-xs shadow-md">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2 mb-3">
            <div>
              <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-bold">
                INTERCHANGE REPAIR PARTS LABEL
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 m-0">{device.name}</h2>
            </div>
            {/* SVG Barcode Mock */}
            <div className="flex flex-col items-end">
              <svg width="100" height="28" viewBox="0 0 100 28" fill="none">
                <rect x="2" width="3" height="24" fill="#000" />
                <rect x="8" width="1" height="24" fill="#000" />
                <rect x="11" width="4" height="24" fill="#000" />
                <rect x="18" width="2" height="24" fill="#000" />
                <rect x="23" width="1" height="24" fill="#000" />
                <rect x="26" width="5" height="24" fill="#000" />
                <rect x="34" width="2" height="24" fill="#000" />
                <rect x="39" width="3" height="24" fill="#000" />
                <rect x="44" width="1" height="24" fill="#000" />
                <rect x="47" width="4" height="24" fill="#000" />
                <rect x="54" width="2" height="24" fill="#000" />
                <rect x="58" width="1" height="24" fill="#000" />
                <rect x="62" width="4" height="24" fill="#000" />
                <rect x="68" width="2" height="24" fill="#000" />
                <rect x="73" width="3" height="24" fill="#000" />
                <rect x="78" width="1" height="24" fill="#000" />
                <rect x="82" width="5" height="24" fill="#000" />
                <rect x="90" width="2" height="24" fill="#000" />
                <rect x="94" width="3" height="24" fill="#000" />
              </svg>
              <div className="font-mono text-[9px] text-slate-600">{device.screenModel || device.id}</div>
            </div>
          </div>

          {/* Device Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 p-2 rounded border border-slate-200">
            <div>
              <div className="text-[9px] font-mono text-slate-500 uppercase">Screen Model Code</div>
              <div className="font-mono font-bold text-xs text-slate-800">{device.screenModel || 'N/A'}</div>
            </div>
            <div>
              <div className="text-[9px] font-mono text-slate-500 uppercase">Dimensions (H × W · R)</div>
              <div className="font-mono font-bold text-xs text-slate-800">
                {device.heightMm && device.widthMm
                  ? `${device.heightMm}×${device.widthMm}mm · r${device.radiusMm || '0'}`
                  : 'Unmeasured'}
              </div>
            </div>
          </div>

          {/* Screen Guard Interchange List */}
          <div className="mb-3">
            <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-600"></span>
              Screen Guard Interchangeable Devices ({matches.originalDrawing.length})
            </div>
            <div className="text-[11px] font-mono bg-teal-50/70 p-2 rounded border border-teal-200 text-slate-800 leading-snug">
              {screenMatchesStr}
            </div>
          </div>

          {/* Case Interchange List */}
          <div>
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-600"></span>
              Phone Case Interchangeable Devices ({matches.baseModel.length})
            </div>
            <div className="text-[11px] font-mono bg-amber-50/70 p-2 rounded border border-amber-200 text-slate-800 leading-snug">
              {caseMatchesStr}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-line no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-lg border border-amber bg-amber text-slate-950 font-bold text-xs cursor-pointer shadow hover:opacity-90 flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Stock Label
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-line bg-paper text-ink font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
