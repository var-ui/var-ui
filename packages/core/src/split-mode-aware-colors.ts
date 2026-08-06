import type { DesignColorValues } from './types';

type ColorPatch = DesignColorValues;
type ScalarColor = string | number;

function isScalarColor(value: unknown): value is ScalarColor {
  return typeof value === 'string' || typeof value === 'number';
}

/** Matches TypeStyles mode-aware color leaves (`{ light, dark }` with scalar values). */
export function isModeAwareColorLeaf(
  value: unknown,
): value is { light?: ScalarColor; dark?: ScalarColor } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length === 0) return false;
  for (const entry of Object.values(record)) {
    if (!isScalarColor(entry)) return false;
  }
  return keys.includes('light') || keys.includes('dark');
}

function isNestedColorObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/** Pull `{ light, dark }` leaves out of a color token tree into base + dark patch. */
export function splitModeAwareColorValues(values: ColorPatch | undefined): {
  base: ColorPatch;
  darkPatch: ColorPatch;
} {
  if (!values) return { base: {}, darkPatch: {} };

  const base: Record<string, unknown> = {};
  const darkPatch: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(values)) {
    if (isModeAwareColorLeaf(child)) {
      if (child.light !== undefined) base[key] = child.light;
      else if (child.dark !== undefined) base[key] = child.dark;
      if (child.dark !== undefined) darkPatch[key] = child.dark;
      continue;
    }

    if (isNestedColorObject(child)) {
      const nested = splitModeAwareColorValues(child as ColorPatch);
      if (Object.keys(nested.base).length > 0) base[key] = nested.base;
      if (Object.keys(nested.darkPatch).length > 0) darkPatch[key] = nested.darkPatch;
      continue;
    }

    base[key] = child;
  }

  return {
    base: base as ColorPatch,
    darkPatch: darkPatch as ColorPatch,
  };
}
