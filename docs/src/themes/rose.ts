import { color } from 'typestyles/color';
import {
  createDesignTheme,
  designTokens as p,
  darkSyntaxValues,
  lightSyntaxValues,
  shadowElevationValues,
  type DesignThemePreset,
  type DesignTokens,
} from '@var-ui/core';
import {
  neoBrutalistBorderDarkDefault,
  neoBrutalistBorderDarkStrong,
  neoBrutalistShadowOffsetDark,
  neoBrutalistShadowOffsetLight,
} from './neo-brutalist-shadows';

const roseDarkHue = 355;

const roseLightSubtle = p.palette['rose-2'].var;

const roseLightColorValues = {
  background: {
    app: p.palette['rose-1'].var,
    surface: p.palette['neutral-1'].var,
    subtle: roseLightSubtle,
    elevated: p.palette['neutral-1'].var,
    popover: p.palette['neutral-1'].var,
    muted: roseLightSubtle,
  },
  text: {
    primary: p.palette['rose-10'].var,
    secondary: p.palette['rose-7'].var,
    onAccent: '#000',
    onDanger: p.palette['neutral-1'].var,
    onSuccess: p.palette['neutral-1'].var,
    onWarning: p.palette['stone-10'].var,
    onInfo: p.palette['neutral-1'].var,
  },
  accent: { default: p.palette['crimson-7'].var, hover: p.palette['crimson-8'].var },
  border: {
    default: '#000',
    strong: '#000',
    focus: p.palette['crimson-5'].var,
  },
  shadow: { offset: neoBrutalistShadowOffsetLight(roseLightSubtle) },
  danger: { default: p.palette['red-7'].var, solid: p.palette['red-8'].var },
  success: { default: p.palette['green-7'].var, solid: p.palette['green-8'].var },
  warning: { default: p.palette['amber-7'].var, onSolid: p.palette['stone-10'].var },
  info: { default: p.palette['plum-7'].var, onSolid: p.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.palette['rose-10'].var, 0.55, 'oklch'),
    panel: p.palette['neutral-1'].var,
  },
  link: { default: p.palette['crimson-7'].var, hover: p.palette['crimson-8'].var },
  code: lightSyntaxValues,
};

const roseDarkColorValues = {
  background: {
    app: color.oklch('23%', 0.024, 355),
    surface: color.oklch('27%', 0.022, 355),
    subtle: color.oklch('31%', 0.02, 355),
    elevated: color.oklch('27%', 0.022, 355),
    popover: color.oklch('27%', 0.022, 355),
    muted: color.oklch('31%', 0.02, 355),
  },
  text: {
    primary: p.palette['rose-1'].var,
    secondary: p.palette['rose-3'].var,
    onAccent: '#000',
    onDanger: p.palette['neutral-1'].var,
    onSuccess: p.palette['neutral-1'].var,
    onWarning: p.palette['stone-10'].var,
    onInfo: p.palette['neutral-1'].var,
  },
  accent: { default: p.palette['rose-3'].var, hover: p.palette['rose-2'].var },
  border: {
    default: neoBrutalistBorderDarkDefault(roseDarkHue),
    strong: neoBrutalistBorderDarkStrong(roseDarkHue),
    focus: p.palette['rose-4'].var,
  },
  shadow: { offset: neoBrutalistShadowOffsetDark(roseDarkHue) },
  danger: { default: p.palette['red-4'].var, solid: p.palette['red-7'].var },
  success: { default: p.palette['green-4'].var, solid: p.palette['green-7'].var },
  warning: { default: p.palette['amber-4'].var, onSolid: p.palette['stone-10'].var },
  info: { default: p.palette['plum-4'].var, onSolid: p.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.palette['rose-10'].var, 0.7, 'oklch'),
    panel: color.oklch('27%', 0.022, 355),
  },
  link: { default: p.palette['rose-3'].var, hover: p.palette['rose-2'].var },
  code: darkSyntaxValues,
};

const roseShadowValues = {
  xs: `1px 1px 0 0 ${p.color.shadow.offset.var}`,
  sm: `2px 2px 0 0 ${p.color.shadow.offset.var}`,
  md: `3px 3px 0 0 ${p.color.shadow.offset.var}`,
  lg: `4px 4px 0 0 ${p.color.shadow.offset.var}`,
  xl: `5px 5px 0 0 ${p.color.shadow.offset.var}`,
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

export const rosePreset: DesignThemePreset = {
  tokens: {
    color: roseLightColorValues,
    shadow: roseShadowValues,
  },
  colorMode: {
    dark: roseDarkColorValues,
  },
};

export const roseTheme = createDesignTheme({
  name: 'rose',
  ...rosePreset,
});
