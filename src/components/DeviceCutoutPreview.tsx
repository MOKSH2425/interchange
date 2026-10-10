import type { Device } from '../types/device';

interface Props {
  device: Device;
}

export function DeviceCutoutPreview({ device }: Props) {
  const h = parseFloat(device.heightMm) || 160;
  const w = parseFloat(device.widthMm) || 75;
  const r = parseFloat(device.radiusMm) || 8;

  // Normalize proportions to fit nicely inside SVG viewbox (e.g., 180x280)
  const svgWidth = 140;
  const svgHeight = 220;

  // Scale dimensions proportionally
  const scale = Math.min((svgWidth - 20) / (w || 75), (svgHeight - 30) / (h || 160));
  const rectW = Math.max(50, Math.min(svgWidth - 10, w * scale));
  const rectH = Math.max(90, Math.min(svgHeight - 20, h * scale));
  const rectX = (svgWidth - rectW) / 2;
  const rectY = (svgHeight - rectH) / 2;
  const cornerR = Math.max(4, Math.min(24, r * scale));

  return (
    <div className="bg-paper border border-line-soft rounded-lg p-3 my-3">
      <div className="text-[11px] font-mono text-ink-soft uppercase tracking-wider mb-2 flex items-center justify-between">
        <span>Visual Panel Preview</span>
        <span className="text-[10px] text-teal font-semibold">
          {device.heightMm && device.widthMm ? `${device.heightMm} × ${device.widthMm} mm` : 'Default 1:1 Scale'}
        </span>
      </div>
      <div className="flex items-center justify-center bg-paper-raised border border-line-soft rounded-md p-3 relative overflow-hidden">
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="drop-shadow-sm">
          {/* Outer Phone Chassis Blueprint */}
          <rect
            x={rectX}
            y={rectY}
            width={rectW}
            height={rectH}
            rx={cornerR}
            ry={cornerR}
            fill="none"
            stroke="var(--color-amber)"
            strokeWidth="2.5"
            strokeDasharray="none"
          />

          {/* Inner Display Assembly Border */}
          <rect
            x={rectX + 3}
            y={rectY + 5}
            width={rectW - 6}
            height={rectH - 10}
            rx={Math.max(2, cornerR - 2)}
            ry={Math.max(2, cornerR - 2)}
            fill="var(--color-paper)"
            stroke="var(--color-teal)"
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Camera Cutout Notch / Punch Hole preview */}
          <circle cx={svgWidth / 2} cy={rectY + 12} r="3" fill="var(--color-ink)" opacity="0.8" />

          {/* Dimension Guidelines Lines */}
          <line
            x1={rectX - 4}
            y1={rectY}
            x2={rectX - 4}
            y2={rectY + rectH}
            stroke="var(--color-ink-soft)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <text
            x={rectX - 7}
            y={rectY + rectH / 2}
            fill="var(--color-ink-soft)"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="end"
            transform={`rotate(-90, ${rectX - 7}, ${rectY + rectH / 2})`}
          >
            {device.heightMm ? `${device.heightMm}mm` : 'H'}
          </text>

          <line
            x1={rectX}
            y1={rectY + rectH + 5}
            x2={rectX + rectW}
            y2={rectY + rectH + 5}
            stroke="var(--color-ink-soft)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <text
            x={rectX + rectW / 2}
            y={rectY + rectH + 14}
            fill="var(--color-ink-soft)"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {device.widthMm ? `${device.widthMm}mm` : 'W'}
          </text>
        </svg>

        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-ink-soft bg-paper/90 px-1.5 py-0.5 rounded border border-line-soft">
          Radius: r{device.radiusMm || '0'}mm
        </div>
      </div>
    </div>
  );
}
