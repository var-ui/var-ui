import { alpha } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const text = {
  primary: '#14110D',
  secondary: tokens.color.palette['stone-8'].var,
  onAccent: tokens.color.palette['neutral-1'].var,
  onDanger: tokens.color.palette['neutral-1'].var,
  onSuccess: tokens.color.palette['neutral-1'].var,
  onWarning: tokens.color.palette['stone-10'].var,
  onInfo: tokens.color.palette['neutral-1'].var,
  disabled: alpha(tokens.color.text.secondary.var, 0.45, 'oklch'),
  placeholder: alpha(tokens.color.text.secondary.var, 0.55, 'oklch'),
  info: tokens.color.palette['blue-8'].var,
} satisfies DesignTokens['color']['text'];

export const darkText = {
  primary: tokens.color.palette['slate-1'].var,
  secondary: tokens.color.palette['slate-3'].var,
  onAccent: tokens.color.palette['neutral-1'].var,
  onDanger: tokens.color.palette['neutral-1'].var,
  onSuccess: tokens.color.palette['neutral-1'].var,
  onWarning: tokens.color.palette['stone-10'].var,
  onInfo: tokens.color.palette['neutral-1'].var,
  disabled: alpha(tokens.color.text.secondary.var, 0.45, 'oklch'),
  placeholder: alpha(tokens.color.text.secondary.var, 0.55, 'oklch'),
  info: tokens.color.palette['blue-2'].var,
} satisfies DesignTokens['color']['text'];
