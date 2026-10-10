import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { useDevices } from './hooks/useDevices';
import type { AddDeviceInput } from './hooks/useDevices';
import type { Device, MatchResult } from './types/device';

export interface AppContext {
  devices: Device[];
  addDevice: (input: AddDeviceInput) => Device;
  removeDevice: (id: string) => void;
  findMatches: (device: Device) => MatchResult;
  stats: {
    total: number;
    withScreenModel: number;
    withDimensions: number;
    withBaseModel: number;
  };
}

function App() {
  const ctx = useDevices();

  return (
    <div className="app-shell pb-20">
      <Header />
      <Outlet context={ctx satisfies AppContext} />
      <TabBar />
    </div>
  );
}

export default App;
