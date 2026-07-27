import type { DesignTokens } from '../types';

/** Breakpoint widths — also wired into TypeStyles `breakpoints` in `runtime.ts`. */
export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} satisfies DesignTokens['breakpoint'];

export const designBreakpoints = breakpoint;
