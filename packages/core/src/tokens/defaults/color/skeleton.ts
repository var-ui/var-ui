import { mix } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const skeleton = {
  default: mix(tokens.color.background.subtle.var, tokens.color.border.default.var, 80, 'oklch'),
} satisfies DesignTokens['color']['skeleton'];

export const darkSkeleton = {
  default: mix(tokens.color.background.subtle.var, tokens.color.border.default.var, 80, 'oklch'),
} satisfies DesignTokens['color']['skeleton'];
