import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const border = {
  default: tokens.color.palette['neutral-3'].var,
  strong: tokens.color.palette['neutral-4'].var,
  focus: tokens.color.palette['blue-5'].var,
  subtle: tokens.color.palette['neutral-2'].var,
} satisfies DesignTokens['color']['border'];

export const darkBorder = {
  default: tokens.color.palette['slate-8'].var,
  strong: tokens.color.palette['slate-7'].var,
  focus: tokens.color.palette['blue-6'].var,
  subtle: tokens.color.palette['slate-9'].var,
} satisfies DesignTokens['color']['border'];
