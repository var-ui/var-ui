import type { DesignTokens } from '../types';

export const zIndex = {
  base: 0,
  raised: 1,
  sticky: 10,
  dropdown: 100,
  overlay: 400,
  toast: 500,
  modal: 1000,
  max: 9999,
} satisfies DesignTokens['zIndex'];
