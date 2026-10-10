import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppSettings, Device, MatchResult } from '../types/device';
import {
  loadDevices,
  saveDevices,
  loadFavorites,
  saveFavorites,
  loadSettings,
  saveSettings,
  resetToStarter,
} from '../lib/storage';

export function brandOf(name: string): string {
  return name.trim().split(' ')[0] || 'Other';
}

/** Turns "link to an existing device's group" input into a resolved group code,
 *  creating a new shared group on the linked device if it doesn't have one yet. */
function resolveGroupLink(
  devices: Device[],
  linkName: string,
  field: 'screenModel' | 'baseModel',
  prefix: string
): { groupCode: string; updatedDevices: Device[] } {
  const trimmed = linkName.trim();
  if (!trimmed) return { groupCode: '', updatedDevices: devices };

  const linked = devices.find((d) => d.name.toLowerCase() === trimmed.toLowerCase());
  if (linked && linked[field]) {
    return { groupCode: linked[field], updatedDevices: devices };
  }
  if (linked) {
    const groupCode = `CUSTOM-${prefix}-${linked.id}`;
    const updatedDevices = devices.map((d) =>
      d.id === linked.id ? { ...d, [field]: groupCode } : d
    );
    return { groupCode, updatedDevices };
  }
  const groupCode = `CUSTOM-${prefix}-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return { groupCode, updatedDevices: devices };
}

export interface AddDeviceInput {
  name: string;
  linkScreenModelTo: string;
  heightMm: string;
  widthMm: string;
  radiusMm: string;
  linkBaseModelTo: string;
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>(() => loadDevices());
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [settings, setSettingsState] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    // Apply theme class to body/html
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const persist = useCallback((next: Device[]) => {
    setDevices(next);
    saveDevices(next);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...newSettings };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const addDevice = useCallback(
    (input: AddDeviceInput) => {
      let working = devices;

      const screenLink = resolveGroupLink(working, input.linkScreenModelTo, 'screenModel', 'SCR');
      working = screenLink.updatedDevices;

      const baseLink = resolveGroupLink(working, input.linkBaseModelTo, 'baseModel', 'BASE');
      working = baseLink.updatedDevices;

      const newDevice: Device = {
        id: `d_${Date.now()}`,
        name: input.name.trim(),
        screenModel: screenLink.groupCode,
        heightMm: input.heightMm.trim(),
        widthMm: input.widthMm.trim(),
        radiusMm: input.radiusMm.trim(),
        baseModel: baseLink.groupCode,
      };

      const next = [...working, newDevice];
      persist(next);
      return newDevice;
    },
    [devices, persist]
  );

  const removeDevice = useCallback(
    (id: string) => {
      persist(devices.filter((d) => d.id !== id));
      if (favorites.includes(id)) {
        toggleFavorite(id);
      }
    },
    [devices, favorites, persist, toggleFavorite]
  );

  const importDevices = useCallback(
    (imported: Device[], mode: 'merge' | 'replace' = 'merge') => {
      if (mode === 'replace') {
        persist(imported);
      } else {
        const existingMap = new Map(devices.map((d) => [d.name.toLowerCase(), d]));
        for (const item of imported) {
          existingMap.set(item.name.toLowerCase(), item);
        }
        persist(Array.from(existingMap.values()));
      }
    },
    [devices, persist]
  );

  const resetDatabase = useCallback(() => {
    const seeded = resetToStarter();
    setDevices(seeded);
  }, []);

  const findMatches = useCallback(
    (device: Device): MatchResult => {
      const originalDrawing = device.screenModel
        ? devices.filter(
            (d) =>
              d.id !== device.id &&
              d.screenModel.toLowerCase() === device.screenModel.toLowerCase()
          )
        : [];

      const hasDimensions = !!(device.heightMm && device.widthMm && device.radiusMm);
      const targetH = parseFloat(device.heightMm);
      const targetW = parseFloat(device.widthMm);

      const fullTemper = hasDimensions
        ? devices.filter(
            (d) =>
              d.id !== device.id &&
              d.heightMm === device.heightMm &&
              d.widthMm === device.widthMm &&
              d.radiusMm === device.radiusMm
          )
        : [];

      let toleranceMatches: { device: Device; diffMm: number }[] = [];
      const tolerance = settings.toleranceMm;

      if (hasDimensions && tolerance > 0 && !isNaN(targetH) && !isNaN(targetW)) {
        toleranceMatches = devices
          .filter((d) => {
            if (d.id === device.id) return false;
            // Exclude exact full temper matches to avoid duplicates
            if (d.heightMm === device.heightMm && d.widthMm === device.widthMm && d.radiusMm === device.radiusMm) {
              return false;
            }
            const h = parseFloat(d.heightMm);
            const w = parseFloat(d.widthMm);
            if (isNaN(h) || isNaN(w)) return false;

            const diffH = Math.abs(h - targetH);
            const diffW = Math.abs(w - targetW);
            return diffH <= tolerance && diffW <= tolerance;
          })
          .map((d) => {
            const h = parseFloat(d.heightMm);
            const w = parseFloat(d.widthMm);
            const diff = Math.max(Math.abs(h - targetH), Math.abs(w - targetW));
            return { device: d, diffMm: Number(diff.toFixed(1)) };
          })
          .sort((a, b) => a.diffMm - b.diffMm);
      }

      const baseModel = device.baseModel
        ? devices.filter(
            (d) => d.id !== device.id && d.baseModel.toLowerCase() === device.baseModel.toLowerCase()
          )
        : [];

      return { originalDrawing, fullTemper, baseModel, toleranceMatches };
    },
    [devices, settings.toleranceMm]
  );

  const stats = useMemo(
    () => ({
      total: devices.length,
      withScreenModel: devices.filter((d) => d.screenModel).length,
      withDimensions: devices.filter((d) => d.heightMm && d.widthMm && d.radiusMm).length,
      withBaseModel: devices.filter((d) => d.baseModel).length,
      favoritesCount: favorites.length,
    }),
    [devices, favorites]
  );

  return {
    devices,
    favorites,
    settings,
    updateSettings,
    toggleFavorite,
    isFavorite,
    addDevice,
    removeDevice,
    importDevices,
    resetDatabase,
    findMatches,
    stats,
  };
}

