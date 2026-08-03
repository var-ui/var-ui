import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const warning = {
  default: tokens.color.palette['amber-7'].var,
  onSolid: tokens.color.palette['stone-10'].var,
  subtle: alpha(tokens.color.warning.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.warning.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['warning'];

export const darkWarning = {
  default: tokens.color.palette['amber-4'].var,
  onSolid: tokens.color.palette['stone-10'].var,
  subtle: alpha(tokens.color.warning.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.warning.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['warning'];
