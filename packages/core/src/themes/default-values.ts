import { color } from 'typestyles/color';
import { paletteTokens } from '../tokens/primitives';
import type { DesignTokens } from '../tokens/types';
import {
  neoBrutalistBorderDarkDefault,
  neoBrutalistBorderDarkStrong,
  neoBrutalistShadowOffsetDark,
  neoBrutalistShadowOffsetLight,
} from './neo-brutalist-shadows';

/** Hue for dark chrome borders / shadow offset (aligned with soft dark field). */
const defaultDarkHue = 88;

/** Warm paper field (editorial / technical print). */
const defaultLightSubtle = paletteTokens['sand-2'];

export const defaultLightSyntaxValues: DesignTokens['color']['syntax'] = {
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

export const defaultDarkSyntaxValues: DesignTokens['color']['syntax'] = {
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

export const defaultLightColorValues = {
  background: {
    app: '#F5F1E9',
    surface: '#FAF8F2',
    subtle: defaultLightSubtle,
    elevated: '#FFFCF6',
    popover: '#FFFCF6',
    muted: defaultLightSubtle,
  },
  text: {
    primary: '#14110D',
    secondary: paletteTokens['stone-8'],
    onAccent: paletteTokens['neutral-1'],
    onDanger: paletteTokens['neutral-1'],
    onSuccess: paletteTokens['neutral-1'],
    onWarning: paletteTokens['stone-10'],
    onInfo: paletteTokens['neutral-1'],
  },
  accent: { default: paletteTokens['sky-7'], hover: paletteTokens['sky-8'] },
  border: {
    default: '#000',
    strong: '#000',
    focus: paletteTokens['blue-5'],
  },
  shadow: { offset: neoBrutalistShadowOffsetLight(defaultLightSubtle) },
  danger: { default: paletteTokens['red-7'], solid: paletteTokens['red-8'] },
  success: { default: paletteTokens['green-7'], solid: paletteTokens['green-8'] },
  warning: { default: paletteTokens['amber-7'], onSolid: paletteTokens['stone-10'] },
  info: { default: paletteTokens['violet-7'], onSolid: paletteTokens['neutral-1'] },
  link: {
    default: paletteTokens['sky-7'],
    hover: paletteTokens['sky-8'],
  },
  overlay: {
    default: color.alpha(paletteTokens['slate-10'], 0.55, 'oklch'),
    panel: '#FFFCF6',
  },
  syntax: defaultLightSyntaxValues,
};

export const defaultDarkColorValues = {
  background: {
    /** Soft warm field — not ink-black; pairs with cream light mode. */
    app: color.oklch('23%', 0.012, 88),
    surface: color.oklch('27%', 0.011, 88),
    subtle: color.oklch('31%', 0.01, 88),
    elevated: color.oklch('27%', 0.011, 88),
    popover: color.oklch('27%', 0.011, 88),
    muted: color.oklch('31%', 0.01, 88),
  },
  text: {
    primary: paletteTokens['slate-1'],
    secondary: paletteTokens['slate-3'],
    onAccent: paletteTokens['neutral-1'],
    onDanger: paletteTokens['neutral-1'],
    onSuccess: paletteTokens['neutral-1'],
    onWarning: paletteTokens['stone-10'],
    onInfo: paletteTokens['neutral-1'],
  },
  accent: { default: paletteTokens['blue-4'], hover: paletteTokens['blue-3'] },
  border: {
    default: neoBrutalistBorderDarkDefault(defaultDarkHue),
    strong: neoBrutalistBorderDarkStrong(defaultDarkHue),
    focus: paletteTokens['blue-4'],
  },
  shadow: { offset: neoBrutalistShadowOffsetDark(defaultDarkHue) },
  danger: { default: paletteTokens['red-4'], solid: paletteTokens['red-7'] },
  success: { default: paletteTokens['green-4'], solid: paletteTokens['green-7'] },
  warning: { default: paletteTokens['amber-4'], onSolid: paletteTokens['stone-10'] },
  info: { default: paletteTokens['violet-4'], onSolid: paletteTokens['neutral-1'] },
  link: {
    default: paletteTokens['blue-4'],
    hover: paletteTokens['blue-3'],
  },
  overlay: {
    default: color.alpha(paletteTokens['slate-10'], 0.7, 'oklch'),
    panel: color.oklch('27%', 0.011, 88),
  },
  syntax: defaultDarkSyntaxValues,
};
