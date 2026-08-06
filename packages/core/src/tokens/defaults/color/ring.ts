import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const ring = {
  default: alpha(tokens.color.tone.accent.foreground.var, 0.45, 'oklch'),
} satisfies DesignTokens['color']['ring'];

export const darkRing = {
  default: alpha(tokens.color.tone.accent.foreground.var, 0.45, 'oklch'),
} satisfies DesignTokens['color']['ring'];
