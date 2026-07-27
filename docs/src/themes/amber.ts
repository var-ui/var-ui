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

const amberDarkHue = 65;

const amberLightSubtle = p.palette['sand-2'].var;

const amberLightColorValues = {
  background: {
    app: p.palette['sand-1'].var,
    surface: p.palette['neutral-1'].var,
    subtle: amberLightSubtle,
    elevated: p.palette['neutral-1'].var,
    popover: p.palette['neutral-1'].var,
    muted: amberLightSubtle,
  },
  text: {
    primary: p.palette['sand-10'].var,
    secondary: p.palette['sand-7'].var,
    onAccent: '#000',
    onDanger: p.palette['neutral-1'].var,
    onSuccess: p.palette['neutral-1'].var,
    onWarning: p.palette['stone-10'].var,
    onInfo: p.palette['neutral-1'].var,
  },
  accent: { default: p.palette['orange-7'].var, hover: p.palette['orange-8'].var },
  border: {
    default: '#000',
    strong: '#000',
    focus: p.palette['orange-5'].var,
  },
  shadow: { offset: neoBrutalistShadowOffsetLight(amberLightSubtle) },
  danger: { default: p.palette['red-7'].var, solid: p.palette['red-8'].var },
  success: { default: p.palette['green-7'].var, solid: p.palette['green-8'].var },
  warning: { default: p.palette['amber-7'].var, onSolid: p.palette['stone-10'].var },
  info: { default: p.palette['orange-7'].var, onSolid: p.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.palette['sand-10'].var, 0.55, 'oklch'),
    panel: p.palette['neutral-1'].var,
  },
  link: { default: p.palette['orange-7'].var, hover: p.palette['orange-8'].var },
  code: lightSyntaxValues,
};

const amberDarkColorValues = {
  background: {
    app: color.oklch('23%', 0.016, 65),
    surface: color.oklch('27%', 0.014, 65),
    subtle: color.oklch('31%', 0.013, 65),
    elevated: color.oklch('27%', 0.014, 65),
    popover: color.oklch('27%', 0.014, 65),
    muted: color.oklch('31%', 0.013, 65),
  },
  text: {
    primary: p.palette['sand-1'].var,
    secondary: p.palette['sand-3'].var,
    onAccent: '#000',
    onDanger: p.palette['neutral-1'].var,
    onSuccess: p.palette['neutral-1'].var,
    onWarning: p.palette['stone-10'].var,
    onInfo: p.palette['neutral-1'].var,
  },
  accent: { default: p.palette['amber-3'].var, hover: p.palette['amber-2'].var },
  border: {
    default: neoBrutalistBorderDarkDefault(amberDarkHue),
    strong: neoBrutalistBorderDarkStrong(amberDarkHue),
    focus: p.palette['amber-4'].var,
  },
  shadow: { offset: neoBrutalistShadowOffsetDark(amberDarkHue) },
  danger: { default: p.palette['red-4'].var, solid: p.palette['red-7'].var },
  success: { default: p.palette['green-4'].var, solid: p.palette['green-7'].var },
  warning: { default: p.palette['amber-4'].var, onSolid: p.palette['stone-10'].var },
  info: { default: p.palette['orange-4'].var, onSolid: p.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.palette['sand-10'].var, 0.7, 'oklch'),
    panel: color.oklch('27%', 0.014, 65),
  },
  link: { default: p.palette['amber-3'].var, hover: p.palette['amber-2'].var },
  code: darkSyntaxValues,
};

const amberShadowValues = {
  xs: `1px 1px 0 0 ${p.color.shadow.offset.var}`,
  sm: `2px 2px 0 0 ${p.color.shadow.offset.var}`,
  md: `3px 3px 0 0 ${p.color.shadow.offset.var}`,
  lg: `4px 4px 0 0 ${p.color.shadow.offset.var}`,
  xl: `5px 5px 0 0 ${p.color.shadow.offset.var}`,
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

export const amberPreset: DesignThemePreset = {
  tokens: {
    color: amberLightColorValues,
    shadow: amberShadowValues,
  },
  colorMode: {
    dark: amberDarkColorValues,
  },
};

export const amberTheme = createDesignTheme({
  name: 'amber',
  ...amberPreset,
});
