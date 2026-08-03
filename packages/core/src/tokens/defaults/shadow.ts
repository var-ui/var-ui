import { tokens } from '../declare';
import type { DesignTokens } from '../types';

/** Mode-aware shadow tint derived from primary text. */
function shadowTint(opacity: number): string {
  return `color-mix(in oklch, ${tokens.color.text.primary.var} ${opacity}%, transparent)`;
}

const shadow8 = shadowTint(8);
const shadow12 = shadowTint(12);
const shadow14 = shadowTint(14);
const shadow16 = shadowTint(16);

/** Compound box-shadow tokens — use directly as `box-shadow` values. */
export const shadow = {
  xs: `0 1px 3px ${shadow12}`,
  sm: `0 2px 4px ${shadow12}`,
  md: `0 4px 12px ${shadow12}`,
  lg: `0 8px 24px ${shadow14}`,
  xl: `0 12px 32px ${shadow16}`,
  elevation: {
    low: `0 1px 2px ${shadow8}`,
    med: `0 4px 12px ${shadow12}`,
    high: `0 12px 32px ${shadow16}`,
  },
} satisfies DesignTokens['shadow'];

export const shadowElevationValues = shadow.elevation;
