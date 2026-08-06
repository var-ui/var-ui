import { tokens } from '../../declare';
import type { DesignTokens } from '../../types';

export const lightCodeValues: DesignTokens['color']['code'] = {
  base: tokens.color.palette['gray-10'].var,
  keyword: tokens.color.palette['purple-6'].var,
  title: tokens.color.palette['blue-6'].var,
  attr: tokens.color.palette['amber-6'].var,
  string: tokens.color.palette['teal-6'].var,
  builtIn: tokens.color.palette['orange-6'].var,
  comment: tokens.color.palette['gray-5'].var,
  name: tokens.color.palette['red-6'].var,
  section: tokens.color.palette['indigo-6'].var,
  bullet: tokens.color.palette['amber-6'].var,
  addition: tokens.color.palette['teal-6'].var,
  additionBackground: tokens.color.palette['emerald-1'].var,
  deletion: tokens.color.palette['red-6'].var,
  deletionBackground: tokens.color.palette['red-1'].var,
};

export const darkCodeValues: DesignTokens['color']['code'] = {
  base: tokens.color.palette['gray-3'].var,
  keyword: tokens.color.palette['violet-4'].var,
  title: tokens.color.palette['blue-4'].var,
  attr: tokens.color.palette['amber-4'].var,
  string: tokens.color.palette['teal-4'].var,
  builtIn: tokens.color.palette['orange-4'].var,
  comment: tokens.color.palette['gray-4'].var,
  name: tokens.color.palette['red-4'].var,
  section: tokens.color.palette['indigo-4'].var,
  bullet: tokens.color.palette['amber-5'].var,
  addition: tokens.color.palette['teal-4'].var,
  additionBackground: tokens.color.palette['emerald-10'].var,
  deletion: tokens.color.palette['red-4'].var,
  deletionBackground: tokens.color.palette['red-10'].var,
};

export const code: DesignTokens['color']['code'] = lightCodeValues;
export const darkCode: DesignTokens['color']['code'] = darkCodeValues;
