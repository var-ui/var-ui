import { alpha, color as colorUtil } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const overlay = {
  default: colorUtil.alpha(tokens.color.palette['slate-10'].var, 0.55, 'oklch'),
  panel: tokens.color.background.elevated.var,
  backdrop: alpha(tokens.color.overlay.default.var, 0.6, 'oklch'),
  hover: alpha(tokens.color.text.primary.var, 0.08, 'oklch'),
  pressed: alpha(tokens.color.text.primary.var, 0.14, 'oklch'),
} satisfies DesignTokens['color']['overlay'];

export const darkOverlay = {
  default: colorUtil.alpha(tokens.color.palette['slate-10'].var, 0.7, 'oklch'),
  panel: tokens.color.background.elevated.var,
  backdrop: alpha(tokens.color.overlay.default.var, 0.6, 'oklch'),
  hover: alpha(tokens.color.text.primary.var, 0.08, 'oklch'),
  pressed: alpha(tokens.color.text.primary.var, 0.14, 'oklch'),
} satisfies DesignTokens['color']['overlay'];
