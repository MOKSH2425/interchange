import { useState } from 'react';
import type { AppSettings, Device } from '../types/device';
import { exportDevicesJSON, exportDevicesCSV, parseImportedJSON } from '../lib/storage';

interface Props {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  devices: Device[];
  importDevices: (imported: Device[], mode?: 'merge' | 'replace') => void;
  resetDatabase: () => void;
  onClose: () => void;
}

export function SettingsModal({
  settings,
  updateSettings,
  devices,
  importDevices,
  resetDatabase,
  onClose,
}: Props) {
  const [importStatus, setImportStatus] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseImportedJSON(text);
        importDevices(parsed, importMode);
        setImportStatus(`Successfully imported ${parsed.length} devices!`);
      } catch (err: any) {
        setImportStatus(`Import Error: ${err.message || 'Failed to parse JSON file'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset database back to original bundled dataset? Custom added devices will be reset.')) {
      resetDatabase();
      setImportStatus('Database reset to initial dataset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-paper-raised border border-line rounded-xl max-w-[440px] w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-line mb-4">
          <div className="text-lg font-display font-bold text-ink">App Settings & Data Backup</div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink font-mono text-sm px-2 py-1 rounded bg-paper border border-line cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Theme Settings */}
        <div className="mb-5 pb-4 border-b border-line-soft">
          <label className="block text-xs font-mono uppercase text-ink-soft mb-2 font-semibold">
            Color Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer ${
                settings.theme === 'dark'
                  ? 'bg-amber text-slate-950 border-amber font-bold'
                  : 'bg-paper text-ink border-line'
              }`}
            >
              🌙 Dark Obsidian
            </button>
            <button
              onClick={() => updateSettings({ theme: 'light' })}
              className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 cursor-pointer ${
                settings.theme === 'light'
                  ? 'bg-amber text-slate-950 border-amber font-bold'
                  : 'bg-paper text-ink border-line'
              }`}
            >
              ☀️ Clean Light
            </button>
          </div>
        </div>

        {/* Dimension Tolerance Settings */}
        <div className="mb-5 pb-4 border-b border-line-soft">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-mono uppercase text-ink-soft font-semibold">
              Full Temper Match Tolerance
            </label>
            <span className="text-xs font-mono text-amber font-bold">
              {settings.toleranceMm > 0 ? `±${settings.toleranceMm} mm` : 'Exact 0.0mm'}
            </span>
          </div>
          <p className="text-[11.5px] text-ink-soft mb-2.5 leading-snug">
            Allows glass matching within a specified dimension difference when exact matches are unavailable.
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {[0, 0.5, 1.0, 1.5, 2.0].map((val) => (
              <button
                key={val}
                onClick={() => updateSettings({ toleranceMm: val })}
                className={`py-1.5 text-xs font-mono rounded border cursor-pointer ${
                  settings.toleranceMm === val
                    ? 'bg-ink text-paper border-ink font-bold'
                    : 'bg-paper text-ink-soft border-line'
                }`}
              >
                {val === 0 ? 'Exact' : `±${val}`}
              </button>
            ))}
          </div>
        </div>

        {/* Database Export Backup */}
        <div className="mb-5 pb-4 border-b border-line-soft">
          <label className="block text-xs font-mono uppercase text-ink-soft mb-1 font-semibold">
            Export Database Backup ({devices.length} devices)
          </label>
          <p className="text-[11.5px] text-ink-soft mb-2.5 leading-snug">
            Download your database to store a safe offline backup or transfer to another phone.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => exportDevicesJSON(devices)}
              className="py-2 rounded-lg border border-line bg-paper text-ink text-xs font-mono font-medium hover:border-ink cursor-pointer"
            >
              📥 Export JSON
            </button>
            <button
              onClick={() => exportDevicesCSV(devices)}
              className="py-2 rounded-lg border border-line bg-paper text-ink text-xs font-mono font-medium hover:border-ink cursor-pointer"
            >
              📊 Export CSV
            </button>
          </div>
        </div>

        {/* Database Import */}
        <div className="mb-5 pb-4 border-b border-line-soft">
          <label className="block text-xs font-mono uppercase text-ink-soft mb-1 font-semibold">
            Import Database (JSON)
          </label>
          <div className="flex gap-2 mb-2">
            <label className="text-[11px] text-ink-soft flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                checked={importMode === 'merge'}
                onChange={() => setImportMode('merge')}
              />
              Merge with existing
            </label>
            <label className="text-[11px] text-ink-soft flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
              />
              Replace database
            </label>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-ink-soft font-mono file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-ink file:text-paper hover:file:opacity-90 cursor-pointer"
          />
          {importStatus && (
            <div className="text-[12px] font-mono mt-2 text-teal bg-teal/10 p-2 rounded border border-teal/20">
              {importStatus}
            </div>
          )}
        </div>

        {/* Reset Database */}
        <div>
          <button
            onClick={handleReset}
            className="w-full py-2.5 rounded-lg border border-danger/40 bg-danger/10 text-danger font-mono text-xs font-semibold cursor-pointer hover:bg-danger/20"
          >
            ⚠️ Reset Database to Original Starter
          </button>
        </div>
      </div>
    </div>
  );
}
