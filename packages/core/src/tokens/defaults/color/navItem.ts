import { color } from 'typestyles/color';
import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const navItem = {
  foreground: tokens.color.text.secondary.var,
  background: 'transparent',
  hoverBackground: tokens.color.background.subtle.var,
  activeBackground: tokens.color.background.info.var,
  selectedBackground: tokens.color.background.info.var,
  selectedForeground: tokens.color.text.info.var,
} satisfies DesignTokens['color']['navItem'];

export const darkNavItem = {
  foreground: tokens.color.text.secondary.var,
  background: 'transparent',
  hoverBackground: tokens.color.background.subtle.var,
  activeBackground: tokens.color.background.info.var,
  selectedBackground: color.alpha(tokens.color.background.info.var, 0.5),
  selectedForeground: tokens.color.text.info.var,
} satisfies DesignTokens['color']['navItem'];
