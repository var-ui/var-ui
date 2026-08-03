import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const success = {
  default: tokens.color.palette['green-7'].var,
  solid: tokens.color.palette['green-8'].var,
  subtle: alpha(tokens.color.success.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.success.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['success'];

export const darkSuccess = {
  default: tokens.color.palette['green-4'].var,
  solid: tokens.color.palette['green-7'].var,
  subtle: alpha(tokens.color.success.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.success.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['success'];
