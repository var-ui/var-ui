import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const background = {
  app: tokens.color.palette['neutral-0'].var,
  surface: tokens.color.palette['neutral-0'].var,
  subtle: tokens.color.palette['neutral-1'].var,
  elevated: tokens.color.palette['neutral-1'].var,
  popover: tokens.color.background.elevated.var,
  muted: tokens.color.background.subtle.var,
  secondary: tokens.color.palette['neutral-2'].var,
  tertiary: tokens.color.palette['neutral-3'].var,
} satisfies DesignTokens['color']['background'];

export const darkBackground = {
  app: tokens.color.palette['slate-10'].var,
  surface: tokens.color.palette['slate-10'].var,
  subtle: tokens.color.palette['slate-9'].var,
  elevated: tokens.color.palette['slate-9'].var,
  popover: tokens.color.background.elevated.var,
  muted: tokens.color.background.subtle.var,
  secondary: tokens.color.palette['neutral-8'].var,
  tertiary: tokens.color.palette['neutral-7'].var,
} satisfies DesignTokens['color']['background'];
