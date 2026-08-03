import { mix } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const accent = {
  default: tokens.color.palette['sky-7'].var,
  hover: tokens.color.palette['sky-8'].var,
  subtle: mix(tokens.color.accent.default.var, tokens.color.background.app.var, 24, 'oklch'),
} satisfies DesignTokens['color']['accent'];

export const darkAccent = {
  default: tokens.color.palette['blue-4'].var,
  hover: tokens.color.palette['blue-3'].var,
  subtle: mix(tokens.color.accent.default.var, tokens.color.background.app.var, 24, 'oklch'),
} satisfies DesignTokens['color']['accent'];
