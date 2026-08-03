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
  neoBrutalistShadowValues,
  resolvedDarkColorModeWhen,
} from './neo-brutalist-shadows';

const forestDarkHue = 165;

const forestLightSubtle = p.color.palette['sage-2'].var;

const forestLightColorValues = {
  background: {
    app: p.color.palette['sage-1'].var,
    surface: p.color.palette['neutral-1'].var,
    subtle: forestLightSubtle,
    elevated: p.color.palette['neutral-1'].var,
    popover: p.color.palette['neutral-1'].var,
    muted: forestLightSubtle,
  },
  text: {
    primary: p.color.palette['sage-10'].var,
    secondary: p.color.palette['sage-7'].var,
    onAccent: '#000',
    onDanger: p.color.palette['neutral-1'].var,
    onSuccess: p.color.palette['neutral-1'].var,
    onWarning: p.color.palette['stone-10'].var,
    onInfo: p.color.palette['neutral-1'].var,
  },
  accent: { default: p.color.palette['green-6'].var, hover: p.color.palette['green-7'].var },
  border: {
    default: '#000',
    strong: '#000',
    focus: p.color.palette['green-5'].var,
  },
  danger: { default: p.color.palette['red-7'].var, solid: p.color.palette['red-8'].var },
  success: { default: p.color.palette['green-7'].var, solid: p.color.palette['green-8'].var },
  warning: { default: p.color.palette['amber-7'].var, onSolid: p.color.palette['stone-10'].var },
  info: { default: p.color.palette['jade-7'].var, onSolid: p.color.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.color.palette['sage-10'].var, 0.55, 'oklch'),
    panel: p.color.palette['neutral-1'].var,
  },
  link: { default: p.color.palette['green-6'].var, hover: p.color.palette['green-7'].var },
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
    primary: p.color.palette['sage-1'].var,
    secondary: p.color.palette['sage-3'].var,
    onAccent: '#000',
    onDanger: p.color.palette['neutral-1'].var,
    onSuccess: p.color.palette['neutral-1'].var,
    onWarning: p.color.palette['stone-10'].var,
    onInfo: p.color.palette['neutral-1'].var,
  },
  accent: { default: p.color.palette['green-3'].var, hover: p.color.palette['green-2'].var },
  border: {
    default: neoBrutalistBorderDarkDefault(forestDarkHue),
    strong: neoBrutalistBorderDarkStrong(forestDarkHue),
    focus: p.color.palette['green-4'].var,
  },
  danger: { default: p.color.palette['red-4'].var, solid: p.color.palette['red-7'].var },
  success: { default: p.color.palette['green-4'].var, solid: p.color.palette['green-7'].var },
  warning: { default: p.color.palette['amber-4'].var, onSolid: p.color.palette['stone-10'].var },
  info: { default: p.color.palette['jade-4'].var, onSolid: p.color.palette['neutral-1'].var },
  overlay: {
    default: color.alpha(p.color.palette['sage-10'].var, 0.7, 'oklch'),
    panel: color.oklch('27%', 0.02, 165),
  },
  link: { default: p.color.palette['green-3'].var, hover: p.color.palette['green-2'].var },
  code: darkSyntaxValues,
};

const forestLightShadowValues = {
  ...neoBrutalistShadowValues(neoBrutalistShadowOffsetLight(forestLightSubtle)),
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

const forestDarkShadowValues = {
  ...neoBrutalistShadowValues(neoBrutalistShadowOffsetDark(forestDarkHue)),
  elevation: shadowElevationValues,
} satisfies DesignTokens['shadow'];

export const forestPreset: DesignThemePreset = {
  tokens: {
    color: forestLightColorValues,
    shadow: forestLightShadowValues,
  },
  colorMode: {
    dark: forestDarkColorValues,
  },
};

export const forestTheme = createDesignTheme({
  name: 'forest',
  ...forestPreset,
  modes: [
    {
      id: 'dark-shadow',
      overrides: { shadow: forestDarkShadowValues },
      when: resolvedDarkColorModeWhen,
    },
  ],
});
