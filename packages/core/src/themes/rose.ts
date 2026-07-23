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

const roseDarkHue = 355;

const roseLightSubtle = p.palette['rose-2'];

const roseLightColorValues = {
  background: {
    app: p.palette['rose-1'],
    surface: p.palette['neutral-1'],
    subtle: roseLightSubtle,
    elevated: p.palette['neutral-1'],
    popover: p.palette['neutral-1'],
    muted: roseLightSubtle,
  },
  text: {
    primary: p.palette['rose-10'],
    secondary: p.palette['rose-7'],
    onAccent: '#000',
    onDanger: p.palette['neutral-1'],
    onSuccess: p.palette['neutral-1'],
    onWarning: p.palette['stone-10'],
    onInfo: p.palette['neutral-1'],
  },
  accent: { default: p.palette['crimson-7'], hover: p.palette['crimson-8'] },
  border: {
    default: '#000',
    strong: '#000',
    focus: p.palette['crimson-5'],
  },
  shadow: { offset: neoBrutalistShadowOffsetLight(roseLightSubtle) },
  danger: { default: p.palette['red-7'], solid: p.palette['red-8'] },
  success: { default: p.palette['green-7'], solid: p.palette['green-8'] },
  warning: { default: p.palette['amber-7'], onSolid: p.palette['stone-10'] },
  info: { default: p.palette['plum-7'], onSolid: p.palette['neutral-1'] },
  overlay: {
    default: color.alpha(p.palette['rose-10'], 0.55, 'oklch'),
    panel: p.palette['neutral-1'],
  },
  link: { default: p.palette['crimson-7'], hover: p.palette['crimson-8'] },
  syntax: defaultLightSyntaxValues,
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
    primary: p.palette['rose-1'],
    secondary: p.palette['rose-3'],
    onAccent: '#000',
    onDanger: p.palette['neutral-1'],
    onSuccess: p.palette['neutral-1'],
    onWarning: p.palette['stone-10'],
    onInfo: p.palette['neutral-1'],
  },
  accent: { default: p.palette['rose-3'], hover: p.palette['rose-2'] },
  border: {
    default: neoBrutalistBorderDarkDefault(roseDarkHue),
    strong: neoBrutalistBorderDarkStrong(roseDarkHue),
    focus: p.palette['rose-4'],
  },
  shadow: { offset: neoBrutalistShadowOffsetDark(roseDarkHue) },
  danger: { default: p.palette['red-4'], solid: p.palette['red-7'] },
  success: { default: p.palette['green-4'], solid: p.palette['green-7'] },
  warning: { default: p.palette['amber-4'], onSolid: p.palette['stone-10'] },
  info: { default: p.palette['plum-4'], onSolid: p.palette['neutral-1'] },
  overlay: {
    default: color.alpha(p.palette['rose-10'], 0.7, 'oklch'),
    panel: color.oklch('27%', 0.022, 355),
  },
  link: { default: p.palette['rose-3'], hover: p.palette['rose-2'] },
  syntax: defaultDarkSyntaxValues,
};

export const roseTokens: DesignTokenPack = {
  tokens: {
    color: roseLightColorValues,
    shadow: createNeoBrutalistShadow(p.color.shadow.offset),
  },
  darkColor: roseDarkColorValues,
};

export const roseTheme = createDesignTheme({
  name: 'rose',
  from: roseTokens,
});
