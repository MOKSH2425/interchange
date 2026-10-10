export interface Device {
  id: string;
  name: string;
  /**
   * Screen Guard Finder — "Original Drawing": devices sharing this code have the
   * exact same screen model & cutout (same combo/display assembly).
   */
  screenModel: string;
  /**
   * Screen Guard Finder — "Full Temper": physical panel dimensions in millimetres.
   * A device only counts as a Full Temper match if ALL THREE values are present
   * and equal to another device's — that's what "100% perfect fit" means here.
   */
  heightMm: string;
  widthMm: string;
  radiusMm: string;
  /**
   * Phone Cases & Base Models — devices sharing this code have the same chassis,
   * so cases/covers interchange between them.
   */
  baseModel: string;
}

export interface MatchResult {
  originalDrawing: Device[];
  fullTemper: Device[];
  baseModel: Device[];
}
