import { useState } from 'react';
import type { AppSettings, Device } from '../types/device';
import { SettingsModal } from './SettingsModal';

interface Props {
  settings?: AppSettings;
  updateSettings?: (newSettings: Partial<AppSettings>) => void;
  devices?: Device[];
  importDevices?: (imported: Device[], mode?: 'merge' | 'replace') => void;
  resetDatabase?: () => void;
}

export function Header({
  settings,
  updateSettings,
  devices = [],
  importDevices = () => {},
  resetDatabase = () => {},
}: Props) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-paper border-b border-line safe-top px-[18px] pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-lg bg-ink flex items-center justify-center shrink-0 shadow-sm">
              <svg width="17" height="17" viewBox="0 0 100 100" fill="none">
                <path
                  d="M15 50h15l8-15 12 30 8-15h15"
                  stroke="#E8A23D"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-[19px] tracking-tight text-ink leading-tight">
                Interchange
              </div>
              <div className="text-[10px] text-ink-soft tracking-wider uppercase">
                Parts cross-reference for repair techs
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {updateSettings && settings && (
              <button
                onClick={() =>
                  updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
                }
                title="Toggle Theme"
                className="w-8 h-8 rounded-lg bg-paper-raised border border-line flex items-center justify-center text-ink cursor-pointer hover:border-amber transition-colors"
              >
                {settings.theme === 'dark' ? '🌙' : '☀️'}
              </button>
            )}

            <button
              onClick={() => setShowSettings(true)}
              title="Settings & Backup"
              className="w-8 h-8 rounded-lg bg-paper-raised border border-line flex items-center justify-center text-ink cursor-pointer hover:border-amber transition-colors"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {showSettings && settings && updateSettings && (
        <SettingsModal
          settings={settings}
          updateSettings={updateSettings}
          devices={devices}
          importDevices={importDevices}
          resetDatabase={resetDatabase}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}

