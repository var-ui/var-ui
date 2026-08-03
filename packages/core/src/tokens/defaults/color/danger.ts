import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const danger = {
  default: tokens.color.palette['red-7'].var,
  solid: tokens.color.palette['red-8'].var,
  subtle: alpha(tokens.color.danger.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.danger.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['danger'];

export const darkDanger = {
  default: tokens.color.palette['red-4'].var,
  solid: tokens.color.palette['red-7'].var,
  subtle: alpha(tokens.color.danger.default.var, 0.12, 'oklch'),
  border: alpha(tokens.color.danger.default.var, 0.4, 'oklch'),
} satisfies DesignTokens['color']['danger'];
