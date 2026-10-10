import { useCallback, useMemo, useState } from 'react';
import type { Device, MatchResult } from '../types/device';
import { loadDevices, saveDevices } from '../lib/storage';

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

  const persist = useCallback((next: Device[]) => {
    setDevices(next);
    saveDevices(next);
  }, []);

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
    },
    [devices, persist]
  );

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
      const fullTemper = hasDimensions
        ? devices.filter(
            (d) =>
              d.id !== device.id &&
              d.heightMm === device.heightMm &&
              d.widthMm === device.widthMm &&
              d.radiusMm === device.radiusMm
          )
        : [];

      const baseModel = device.baseModel
        ? devices.filter(
            (d) => d.id !== device.id && d.baseModel.toLowerCase() === device.baseModel.toLowerCase()
          )
        : [];

      return { originalDrawing, fullTemper, baseModel };
    },
    [devices]
  );

  const stats = useMemo(
    () => ({
      total: devices.length,
      withScreenModel: devices.filter((d) => d.screenModel).length,
      withDimensions: devices.filter((d) => d.heightMm && d.widthMm && d.radiusMm).length,
      withBaseModel: devices.filter((d) => d.baseModel).length,
    }),
    [devices]
  );

  return { devices, addDevice, removeDevice, findMatches, stats };
}
