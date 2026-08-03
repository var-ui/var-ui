import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const info = {
  default: tokens.color.palette['violet-7'].var,
  onSolid: tokens.color.palette['neutral-1'].var,
  subtle: alpha(tokens.color.info.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.info.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['info'];

export const darkInfo = {
  default: tokens.color.palette['violet-4'].var,
  onSolid: tokens.color.palette['neutral-1'].var,
  subtle: alpha(tokens.color.info.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.info.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['info'];
