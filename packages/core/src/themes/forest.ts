import { color } from 'typestyles/color';
import { createDesignTheme } from '../create-theme';
import { designTokens as p } from '../tokens';
import type { DesignTokenPack } from '../types';
import { defaultDarkSyntaxValues, defaultLightSyntaxValues } from './default-values';
import {
  createNeoBrutalistShadow,
  neoBrutalistBorderDarkDefault,
  neoBrutalistBorderDarkStrong,
  neoBrutalistShadowOffsetDark,
  neoBrutalistShadowOffsetLight,
} from './neo-brutalist-shadows';

const forestDarkHue = 165;

const forestLightSubtle = p.palette['sage-2'];

const forestLightColorValues = {
  background: {
    app: p.palette['sage-1'],
    surface: p.palette['neutral-1'],
    subtle: forestLightSubtle,
    elevated: p.palette['neutral-1'],
    popover: p.palette['neutral-1'],
    muted: forestLightSubtle,
  },
  text: {
    primary: p.palette['sage-10'],
    secondary: p.palette['sage-7'],
    onAccent: '#000',
    onDanger: p.palette['neutral-1'],
    onSuccess: p.palette['neutral-1'],
    onWarning: p.palette['stone-10'],
    onInfo: p.palette['neutral-1'],
  },
  accent: { default: p.palette['green-6'], hover: p.palette['green-7'] },
  border: {
    default: '#000',
    strong: '#000',
    focus: p.palette['green-5'],
  },
  shadow: { offset: neoBrutalistShadowOffsetLight(forestLightSubtle) },
  danger: { default: p.palette['red-7'], solid: p.palette['red-8'] },
  success: { default: p.palette['green-7'], solid: p.palette['green-8'] },
  warning: { default: p.palette['amber-7'], onSolid: p.palette['stone-10'] },
  info: { default: p.palette['jade-7'], onSolid: p.palette['neutral-1'] },
  overlay: {
    default: color.alpha(p.palette['sage-10'], 0.55, 'oklch'),
    panel: p.palette['neutral-1'],
  },
  link: { default: p.palette['green-6'], hover: p.palette['green-7'] },
  syntax: defaultLightSyntaxValues,
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
    primary: p.palette['sage-1'],
    secondary: p.palette['sage-3'],
    onAccent: '#000',
    onDanger: p.palette['neutral-1'],
    onSuccess: p.palette['neutral-1'],
    onWarning: p.palette['stone-10'],
    onInfo: p.palette['neutral-1'],
  },
  accent: { default: p.palette['green-3'], hover: p.palette['green-2'] },
  border: {
    default: neoBrutalistBorderDarkDefault(forestDarkHue),
    strong: neoBrutalistBorderDarkStrong(forestDarkHue),
    focus: p.palette['green-4'],
  },
  shadow: { offset: neoBrutalistShadowOffsetDark(forestDarkHue) },
  danger: { default: p.palette['red-4'], solid: p.palette['red-7'] },
  success: { default: p.palette['green-4'], solid: p.palette['green-7'] },
  warning: { default: p.palette['amber-4'], onSolid: p.palette['stone-10'] },
  info: { default: p.palette['jade-4'], onSolid: p.palette['neutral-1'] },
  overlay: {
    default: color.alpha(p.palette['sage-10'], 0.7, 'oklch'),
    panel: color.oklch('27%', 0.02, 165),
  },
  link: { default: p.palette['green-3'], hover: p.palette['green-2'] },
  syntax: defaultDarkSyntaxValues,
};

export const forestTokens: DesignTokenPack = {
  tokens: {
    color: forestLightColorValues,
    shadow: createNeoBrutalistShadow(p.color.shadow.offset),
  },
  darkColor: forestDarkColorValues,
};

export const forestTheme = createDesignTheme({
  name: 'forest',
  from: forestTokens,
});
