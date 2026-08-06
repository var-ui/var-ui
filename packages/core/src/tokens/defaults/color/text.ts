import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const text = {
  primary: '#14110D',
  secondary: tokens.color.palette['stone-8'].var,
  disabled: alpha(tokens.color.text.secondary.var, 0.45, 'oklch'),
  placeholder: alpha(tokens.color.text.secondary.var, 0.55, 'oklch'),
} satisfies DesignTokens['color']['text'];

export const darkText = {
  primary: tokens.color.palette['slate-1'].var,
  secondary: tokens.color.palette['slate-3'].var,
  disabled: alpha(tokens.color.text.secondary.var, 0.45, 'oklch'),
  placeholder: alpha(tokens.color.text.secondary.var, 0.55, 'oklch'),
} satisfies DesignTokens['color']['text'];
