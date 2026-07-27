import { color as colorUtil } from 'typestyles/color';
import { tokens } from '../declare';
import type { DesignTokens } from '../types';

/** Hue for dark neutral chrome (slate family). */
const darkHue = 264;

const shadowColor = `color-mix(in oklch, ${tokens.color.text.primary.var} 12%, transparent)`;

export const lightCodeValues: DesignTokens['color']['code'] = {
  base: 'oklch(24.8% 0.008 264)',
  keyword: 'oklch(54.5% 0.24 301)',
  title: 'oklch(58.5% 0.22 248)',
  attr: 'oklch(50% 0.18 68)',
  string: 'oklch(53.2% 0.18 178)',
  builtIn: 'oklch(56.5% 0.22 48)',
  comment: 'oklch(66.4% 0.014 264)',
  name: 'oklch(57.5% 0.18 29)',
  section: 'oklch(55.2% 0.24 271)',
  bullet: 'oklch(55.5% 0.22 66)',
  addition: 'oklch(58.8% 0.22 176)',
  additionBackground: 'oklch(99.3% 0.01 160)',
  deletion: 'oklch(57.5% 0.18 29)',
  deletionBackground: 'oklch(99.7% 0.008 25)',
};

export const darkCodeValues: DesignTokens['color']['code'] = {
  base: 'oklch(90% 0.002 264)',
  keyword: 'oklch(79.5% 0.17 295)',
  title: 'oklch(82.5% 0.16 245)',
  attr: 'oklch(77.2% 0.24 60)',
  string: 'oklch(81.5% 0.2 170)',
  builtIn: 'oklch(79.5% 0.22 45)',
  comment: 'oklch(77.5% 0.012 264)',
  name: 'oklch(80.3% 0.22 27.5)',
  section: 'oklch(79% 0.17 265)',
  bullet: 'oklch(67.5% 0.28 62)',
  addition: 'oklch(81.5% 0.2 170)',
  additionBackground: 'oklch(18% 0.04 170)',
  deletion: 'oklch(80.3% 0.22 27.5)',
  deletionBackground: 'oklch(18% 0.04 30)',
};

export const color = {
  background: {
    app: tokens.palette['neutral-1'].var,
    surface: tokens.palette['neutral-1'].var,
    subtle: tokens.palette['neutral-2'].var,
    elevated: tokens.palette['neutral-1'].var,
    popover: tokens.color.background.elevated.var,
    muted: tokens.color.background.subtle.var,
  },
  text: {
    primary: '#14110D',
    secondary: tokens.palette['stone-8'].var,
    onAccent: tokens.palette['neutral-1'].var,
    onDanger: tokens.palette['neutral-1'].var,
    onSuccess: tokens.palette['neutral-1'].var,
    onWarning: tokens.palette['stone-10'].var,
    onInfo: tokens.palette['neutral-1'].var,
    disabled: `color-mix(in oklch, ${tokens.color.text.secondary.var} 45%, transparent)`,
    placeholder: `color-mix(in oklch, ${tokens.color.text.secondary.var} 55%, transparent)`,
  },
  accent: {
    default: tokens.palette['sky-7'].var,
    hover: tokens.palette['sky-8'].var,
    subtle: `color-mix(in oklch, ${tokens.color.accent.default.var} 24%, ${tokens.color.background.app.var})`,
  },
  border: {
    default: tokens.palette['neutral-4'].var,
    strong: tokens.palette['neutral-6'].var,
    focus: tokens.palette['blue-5'].var,
  },
  shadow: {
    offset: `color-mix(in oklch, ${tokens.color.text.primary.var} 12%, transparent)`,
    color: shadowColor,
  },
  danger: {
    default: tokens.palette['red-7'].var,
    solid: tokens.palette['red-8'].var,
    subtle: `color-mix(in oklch, ${tokens.color.danger.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.danger.default.var} 40%, transparent)`,
  },
  success: {
    default: tokens.palette['green-7'].var,
    solid: tokens.palette['green-8'].var,
    subtle: `color-mix(in oklch, ${tokens.color.success.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.success.default.var} 40%, transparent)`,
  },
  warning: {
    default: tokens.palette['amber-7'].var,
    onSolid: tokens.palette['stone-10'].var,
    subtle: `color-mix(in oklch, ${tokens.color.warning.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.warning.default.var} 40%, transparent)`,
  },
  info: {
    default: tokens.palette['violet-7'].var,
    onSolid: tokens.palette['neutral-1'].var,
    subtle: `color-mix(in oklch, ${tokens.color.info.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.info.default.var} 40%, transparent)`,
  },
  link: {
    default: tokens.color.accent.default.var,
    hover: tokens.color.accent.hover.var,
  },
  ring: {
    default: `color-mix(in oklch, ${tokens.color.accent.default.var} 45%, transparent)`,
  },
  overlay: {
    default: colorUtil.alpha(tokens.palette['slate-10'].var, 0.55, 'oklch'),
    panel: tokens.color.background.elevated.var,
    backdrop: `color-mix(in oklch, ${tokens.color.overlay.default.var} 60%, transparent)`,
    hover: `color-mix(in oklch, ${tokens.color.text.primary.var} 8%, transparent)`,
    pressed: `color-mix(in oklch, ${tokens.color.text.primary.var} 14%, transparent)`,
  },
  skeleton: {
    default: `color-mix(in oklch, ${tokens.color.background.subtle.var} 80%, ${tokens.color.border.default.var})`,
  },
  track: {
    default: `color-mix(in oklch, ${tokens.color.background.subtle.var} 65%, ${tokens.color.border.default.var})`,
  },
  code: lightCodeValues,
} satisfies DesignTokens['color'];

export const dark = {
  background: {
    app: colorUtil.oklch('20%', 0.01, darkHue),
    surface: colorUtil.oklch('24%', 0.01, darkHue),
    subtle: colorUtil.oklch('28%', 0.01, darkHue),
    elevated: colorUtil.oklch('24%', 0.01, darkHue),
    popover: tokens.color.background.elevated.var,
    muted: tokens.color.background.subtle.var,
  },
  text: {
    primary: tokens.palette['slate-1'].var,
    secondary: tokens.palette['slate-3'].var,
    onAccent: tokens.palette['neutral-1'].var,
    onDanger: tokens.palette['neutral-1'].var,
    onSuccess: tokens.palette['neutral-1'].var,
    onWarning: tokens.palette['stone-10'].var,
    onInfo: tokens.palette['neutral-1'].var,
    disabled: `color-mix(in oklch, ${tokens.color.text.secondary.var} 45%, transparent)`,
    placeholder: `color-mix(in oklch, ${tokens.color.text.secondary.var} 55%, transparent)`,
  },
  accent: {
    default: tokens.palette['blue-4'].var,
    hover: tokens.palette['blue-3'].var,
    subtle: `color-mix(in oklch, ${tokens.color.accent.default.var} 24%, ${tokens.color.background.app.var})`,
  },
  border: {
    default: tokens.palette['slate-4'].var,
    strong: tokens.palette['slate-5'].var,
    focus: tokens.palette['blue-4'].var,
  },
  shadow: {
    offset: `color-mix(in oklch, ${tokens.color.text.primary.var} 20%, transparent)`,
    color: `color-mix(in oklch, ${tokens.color.text.primary.var} 20%, transparent)`,
  },
  danger: {
    default: tokens.palette['red-4'].var,
    solid: tokens.palette['red-7'].var,
    subtle: `color-mix(in oklch, ${tokens.color.danger.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.danger.default.var} 40%, transparent)`,
  },
  success: {
    default: tokens.palette['green-4'].var,
    solid: tokens.palette['green-7'].var,
    subtle: `color-mix(in oklch, ${tokens.color.success.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.success.default.var} 40%, transparent)`,
  },
  warning: {
    default: tokens.palette['amber-4'].var,
    onSolid: tokens.palette['stone-10'].var,
    subtle: `color-mix(in oklch, ${tokens.color.warning.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.warning.default.var} 40%, transparent)`,
  },
  info: {
    default: tokens.palette['violet-4'].var,
    onSolid: tokens.palette['neutral-1'].var,
    subtle: `color-mix(in oklch, ${tokens.color.info.default.var} 12%, transparent)`,
    border: `color-mix(in oklch, ${tokens.color.info.default.var} 40%, transparent)`,
  },
  link: {
    default: tokens.color.accent.default.var,
    hover: tokens.color.accent.hover.var,
  },
  ring: {
    default: `color-mix(in oklch, ${tokens.color.accent.default.var} 45%, transparent)`,
  },
  overlay: {
    default: colorUtil.alpha(tokens.palette['slate-10'].var, 0.7, 'oklch'),
    panel: tokens.color.background.elevated.var,
    backdrop: `color-mix(in oklch, ${tokens.color.overlay.default.var} 60%, transparent)`,
    hover: `color-mix(in oklch, ${tokens.color.text.primary.var} 8%, transparent)`,
    pressed: `color-mix(in oklch, ${tokens.color.text.primary.var} 14%, transparent)`,
  },
  skeleton: {
    default: `color-mix(in oklch, ${tokens.color.background.subtle.var} 80%, ${tokens.color.border.default.var})`,
  },
  track: {
    default: `color-mix(in oklch, ${tokens.color.background.subtle.var} 65%, ${tokens.color.border.default.var})`,
  },
  code: darkCodeValues,
} satisfies DesignTokens['color'];

export const lightSyntaxValues = lightCodeValues;
export const darkSyntaxValues = darkCodeValues;
