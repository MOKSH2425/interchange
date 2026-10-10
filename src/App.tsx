import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { useDevices } from './hooks/useDevices';
import type { AddDeviceInput } from './hooks/useDevices';
import type { AppSettings, Device, MatchResult } from './types/device';

export interface AppContext {
  devices: Device[];
  favorites: string[];
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addDevice: (input: AddDeviceInput) => Device;
  removeDevice: (id: string) => void;
  importDevices: (imported: Device[], mode?: 'merge' | 'replace') => void;
  resetDatabase: () => void;
  findMatches: (device: Device) => MatchResult;
  stats: {
    total: number;
    withScreenModel: number;
    withDimensions: number;
    withBaseModel: number;
    favoritesCount: number;
  };
}

function App() {
  const ctx = useDevices();

  return (
    <div className="app-shell pb-20">
      <Header
        settings={ctx.settings}
        updateSettings={ctx.updateSettings}
        devices={ctx.devices}
        importDevices={ctx.importDevices}
        resetDatabase={ctx.resetDatabase}
      />
      <Outlet context={ctx satisfies AppContext} />
      <TabBar />
    </div>
  );
}

export default App;

