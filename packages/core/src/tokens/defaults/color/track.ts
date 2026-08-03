import { mix } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const track = {
  default: mix(tokens.color.background.subtle.var, tokens.color.border.default.var, 65, 'oklch'),
} satisfies DesignTokens['color']['track'];

export const darkTrack = {
  default: mix(tokens.color.background.subtle.var, tokens.color.border.default.var, 65, 'oklch'),
} satisfies DesignTokens['color']['track'];
