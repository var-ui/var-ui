import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const link = {
  default: tokens.color.tone.accent.foreground.var,
  hover: tokens.color.palette['plum-8'].var,
} satisfies DesignTokens['color']['link'];

export const darkLink = {
  default: tokens.color.tone.accent.foreground.var,
  hover: tokens.color.palette['plum-3'].var,
} satisfies DesignTokens['color']['link'];
