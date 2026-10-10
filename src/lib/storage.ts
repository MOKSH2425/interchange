import type { Device, AppSettings } from '../types/device';
import starterDevices from '../data/devices.json';

const STORAGE_KEY = 'interchange_devices_v5';
const FAVORITES_KEY = 'interchange_favorites_v1';
const SETTINGS_KEY = 'interchange_settings_v1';

export function loadDevices(): Device[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Device[];
  } catch {
    // fall through to seed
  }
  const seeded = starterDevices as Device[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export function saveDevices(devices: Device[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
}

export function resetToStarter(): Device[] {
  const seeded = starterDevices as Device[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // fallback
  }
  return [];
}

export function saveFavorites(favs: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppSettings;
      return {
        theme: parsed.theme || 'dark',
        toleranceMm: typeof parsed.toleranceMm === 'number' ? parsed.toleranceMm : 0,
      };
    }
  } catch {
    // fallback
  }
  return { theme: 'dark', toleranceMm: 0 };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportDevicesJSON(devices: Device[]): void {
  const jsonStr = JSON.stringify(devices, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interchange_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportDevicesCSV(devices: Device[]): void {
  const headers = ['id', 'name', 'screenModel', 'heightMm', 'widthMm', 'radiusMm', 'baseModel'];
  const rows = devices.map((d) => [
    `"${(d.id || '').replace(/"/g, '""')}"`,
    `"${(d.name || '').replace(/"/g, '""')}"`,
    `"${(d.screenModel || '').replace(/"/g, '""')}"`,
    `"${(d.heightMm || '').replace(/"/g, '""')}"`,
    `"${(d.widthMm || '').replace(/"/g, '""')}"`,
    `"${(d.radiusMm || '').replace(/"/g, '""')}"`,
    `"${(d.baseModel || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interchange_database_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedJSON(rawText: string): Device[] {
  const parsed = JSON.parse(rawText);
  if (!Array.isArray(parsed)) throw new Error('Invalid JSON format: expected an array of devices');
  return parsed.map((item: any, idx: number) => ({
    id: item.id || `imported_${Date.now()}_${idx}`,
    name: String(item.name || 'Unknown Device').trim(),
    screenModel: String(item.screenModel || '').trim(),
    heightMm: String(item.heightMm || '').trim(),
    widthMm: String(item.widthMm || '').trim(),
    radiusMm: String(item.radiusMm || '').trim(),
    baseModel: String(item.baseModel || '').trim(),
  }));
}

