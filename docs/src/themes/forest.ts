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

const forestDarkHue = 165;

const forestLightSubtle = p.palette['sage-2'].var;

const forestLightColorValues = {
  background: {
    app: p.palette['sage-1'].var,
    surface: p.palette['neutral-1'].var,
    subtle: forestLightSubtle,
    elevated: p.palette['neutral-1'].var,
    popover: p.palette['neutral-1'].var,
    muted: forestLightSubtle,
  },
  text: {
    primary: p.palette['sage-10'].var,
    secondary: p.palette['sage-7'].var,
    onAccent: '#000',
    onDanger: p.palette['neutral-1'].var,
    onSuccess: p.palette['neutral-1'].var,
    onWarning: p.palette['stone-10'].var,
    onInfo: p.palette['neutral-1'].var,
  },
  accent: { default: p.palette['green-6'].var, hover: p.palette['green-7'].var },
  border: {
    default: '#000',
    strong: '#000',
    focus: p.palette['green-5'].var,
  },
  shadow: { offset: neoBrutalistShadowOffsetLight(forestLightSubtle) },
  danger: { default: p.palette['red-7'].var, solid: p.palette['red-8'].var },
  success: { default: p.palette['green-7'].var, solid: p.palette['green-8'].var },
  warning: { default: p.palette['amber-7'].var, onSolid: p.palette['stone-10'].var },
  info: { default: p.palette['jade-7'].var, onSolid: p.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.palette['sage-10'].var, 0.55, 'oklch'),
    panel: p.palette['neutral-1'].var,
  },
  link: { default: p.palette['green-6'].var, hover: p.palette['green-7'].var },
  code: lightSyntaxValues,
};

const forestDarkColorValues = {
  background: {
    app: color.oklch('23%', 0.022, 165),
    surface: color.oklch('27%', 0.02, 165),
    subtle: color.oklch('31%', 0.018, 165),
    elevated: color.oklch('27%', 0.02, 165),
    popover: color.oklch('27%', 0.02, 165),
    muted: color.oklch('31%', 0.018, 165),
  },
  text: {
    primary: p.palette['sage-1'].var,
    secondary: p.palette['sage-3'].var,
    onAccent: '#000',
    onDanger: p.palette['neutral-1'].var,
    onSuccess: p.palette['neutral-1'].var,
    onWarning: p.palette['stone-10'].var,
    onInfo: p.palette['neutral-1'].var,
  },
  accent: { default: p.palette['green-3'].var, hover: p.palette['green-2'].var },
  border: {
    default: neoBrutalistBorderDarkDefault(forestDarkHue),
    strong: neoBrutalistBorderDarkStrong(forestDarkHue),
    focus: p.palette['green-4'].var,
  },
  shadow: { offset: neoBrutalistShadowOffsetDark(forestDarkHue) },
  danger: { default: p.palette['red-4'].var, solid: p.palette['red-7'].var },
  success: { default: p.palette['green-4'].var, solid: p.palette['green-7'].var },
  warning: { default: p.palette['amber-4'].var, onSolid: p.palette['stone-10'].var },
  info: { default: p.palette['jade-4'].var, onSolid: p.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.palette['sage-10'].var, 0.7, 'oklch'),
    panel: color.oklch('27%', 0.02, 165),
  },
  link: { default: p.palette['green-3'].var, hover: p.palette['green-2'].var },
  code: darkSyntaxValues,
};

const forestShadowValues = {
  xs: `1px 1px 0 0 ${p.color.shadow.offset.var}`,
  sm: `2px 2px 0 0 ${p.color.shadow.offset.var}`,
  md: `3px 3px 0 0 ${p.color.shadow.offset.var}`,
  lg: `4px 4px 0 0 ${p.color.shadow.offset.var}`,
  xl: `5px 5px 0 0 ${p.color.shadow.offset.var}`,
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

export const forestPreset: DesignThemePreset = {
  tokens: {
    color: forestLightColorValues,
    shadow: forestShadowValues,
  },
  colorMode: {
    dark: forestDarkColorValues,
  },
};

export const forestTheme = createDesignTheme({
  name: 'forest',
  ...forestPreset,
});
