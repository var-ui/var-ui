import { tokens } from '../declare';
import type { DesignTokens } from '../types';

export const transition = {
  overlayFade: `opacity ${tokens.duration.slow.var} ${tokens.easing.standard.var}, visibility ${tokens.duration.slow.var} ${tokens.easing.standard.var}`,
  panelEnter: `opacity ${tokens.duration.slow.var} ${tokens.easing.emphasized.var}`,
  backdrop: `opacity ${tokens.duration.slow.var} ${tokens.easing.standard.var}`,
  surfaceFast: `background-color ${tokens.duration.fast.var} ${tokens.easing.standard.var}`,
  colorShift: `color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, text-decoration-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  controlSurface: `background-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, border-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
} satisfies DesignTokens['transition'];
