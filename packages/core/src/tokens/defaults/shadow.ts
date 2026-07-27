import { tokens } from '../declare';
import type { DesignTokens } from '../types';

const shadowColor = `color-mix(in oklch, ${tokens.color.text.primary.var} 12%, transparent)`;

export const shadow = {
  xs: `0 1px 2px ${shadowColor}`,
  sm: `0 2px 4px ${shadowColor}`,
  md: `0 4px 12px ${shadowColor}`,
  lg: `0 8px 24px color-mix(in oklch, ${tokens.color.text.primary.var} 14%, transparent)`,
  xl: `0 12px 32px color-mix(in oklch, ${tokens.color.text.primary.var} 16%, transparent)`,
  elevation: {
    low: `0 1px 2px color-mix(in oklch, ${tokens.color.text.primary.var} 8%, transparent)`,
    med: `0 4px 12px color-mix(in oklch, ${tokens.color.text.primary.var} 12%, transparent)`,
    high: `0 12px 32px color-mix(in oklch, ${tokens.color.text.primary.var} 16%, transparent)`,
  },
} satisfies DesignTokens['shadow'];

export const shadowElevationValues = shadow.elevation;
