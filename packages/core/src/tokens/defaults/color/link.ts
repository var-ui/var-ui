import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const link = {
  default: tokens.color.accent.default.var,
  hover: tokens.color.accent.hover.var,
} satisfies DesignTokens['color']['link'];

export const darkLink = {
  default: tokens.color.accent.default.var,
  hover: tokens.color.accent.hover.var,
} satisfies DesignTokens['color']['link'];
