import type { Device } from '../types/device';
import starterDevices from '../data/devices.json';

const STORAGE_KEY = 'interchange_devices_v5';

/**
 * Loads devices from localStorage, seeding with the bundled starter
 * dataset the first time the app runs on a given browser/phone.
 */
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

/** Resets the local database back to the bundled starter dataset. */
export function resetToStarter(): Device[] {
  const seeded = starterDevices as Device[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}
