import { color as colorUtil } from 'typestyles/color';
import {
  expandDurationBand,
  generateGeometricScale,
  generateLinearScale,
} from 'typestyles/token-scale';
import { tokens } from '../tokens/declare';
import type { DesignTokens } from '../tokens/types';
import {
  neoBrutalistBorderDarkDefault,
  neoBrutalistBorderDarkStrong,
  neoBrutalistShadowOffsetDark,
  neoBrutalistShadowOffsetLight,
} from './neo-brutalist-shadows';

function zipPx<T extends string>(names: readonly T[], values: number[]): Record<T, `${number}px`> {
  return Object.fromEntries(names.map((name, index) => [name, `${values[index]}px`])) as Record<
    T,
    `${number}px`
  >;
}

// base: 4, multiplier: 0 — brutalist default; all scaled steps stay 0px.
const RADIUS_STEPS = [1, 2, 3, 4] as const;
const RADIUS_NAMES = ['sm', 'md', 'lg', 'xl'] as const;
const radiusScale = generateLinearScale({
  base: 4,
  multiplier: 0,
  steps: [...RADIUS_STEPS],
});

const FONT_SIZE_STEPS = [-2, -1, 0, 1, 2, 3, 4] as const;
const FONT_SIZE_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const fontSizeScale = generateGeometricScale({
  base: 14,
  ratio: 1.2,
  steps: [...FONT_SIZE_STEPS],
});

const fastBand = expandDurationBand({ base: 80, ratio: 0.75 });
const mediumBand = expandDurationBand({ base: 140, ratio: 0.75 });
const slowBand = expandDurationBand({ base: 220, ratio: 0.75 });

export const defaultSpaceValues = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '28px',
  8: '48px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '64px',
  16: '64px',
  20: '80px',
} satisfies DesignTokens['space'];

export const defaultSizeValues = {
  control: { sm: '28px', md: '32px', lg: '36px' },
  icon: { sm: '14px', md: '16px', lg: '20px' },
} satisfies DesignTokens['size'];

export const defaultOpacityValues = {
  disabled: '0.5',
  muted: '0.6',
} satisfies DesignTokens['opacity'];

export const defaultLetterSpacingValues = {
  tight: '-0.015em',
  normal: '0',
  wide: '0.025em',
  caps: '0.06em',
} satisfies DesignTokens['letterSpacing'];

export const defaultRadiusValues = {
  none: '0',
  ...zipPx(RADIUS_NAMES, radiusScale),
  full: '0',
} satisfies DesignTokens['radius'];

export const defaultBorderWidthValues = {
  thin: '1px',
  default: '1px',
  thick: '2px',
} satisfies DesignTokens['borderWidth'];

export const defaultFontFamilyValues = {
  display:
    '"Fraunces", "Iowan Old Style", "Apple Garamond", Baskerville, "Palatino Linotype", Palatino, Georgia, serif',
  sans: '"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
} satisfies DesignTokens['fontFamily'];

export const defaultFontSizeValues = zipPx(
  FONT_SIZE_NAMES,
  fontSizeScale,
) satisfies DesignTokens['fontSize'];

export const defaultFontWeightValues = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} satisfies DesignTokens['fontWeight'];

export const defaultLineHeightValues = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.625',
} satisfies DesignTokens['lineHeight'];

export const defaultShadowValues = {
  xs: '1px 1px 0 0 #000',
  sm: '2px 2px 0 0 #000',
  md: '3px 3px 0 0 #000',
  lg: '4px 4px 0 0 #000',
  xl: '5px 5px 0 0 #000',
  elevation: {
    low: `0 1px 2px color-mix(in oklch, ${tokens.color.text.primary.var} 8%, transparent)`,
    med: `0 4px 12px color-mix(in oklch, ${tokens.color.text.primary.var} 12%, transparent)`,
    high: `0 12px 32px color-mix(in oklch, ${tokens.color.text.primary.var} 16%, transparent)`,
  },
} satisfies DesignTokens['shadow'];

export const shadowElevationValues = defaultShadowValues.elevation;

export const defaultDurationValues = {
  fast: '80ms',
  medium: '140ms',
  slow: '220ms',
  'fast-min': `${fastBand.min}ms`,
  'fast-max': `${fastBand.max}ms`,
  'medium-min': `${mediumBand.min}ms`,
  'medium-max': `${mediumBand.max}ms`,
  'slow-min': `${slowBand.min}ms`,
  'slow-max': `${slowBand.max}ms`,
} satisfies DesignTokens['duration'];

export const defaultEasingValues = {
  standard: 'ease',
  emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
} satisfies DesignTokens['easing'];

export const defaultTransitionValues = {
  overlayFade: `opacity ${tokens.duration.slow.var} ${tokens.easing.standard.var}, visibility ${tokens.duration.slow.var} ${tokens.easing.standard.var}`,
  panelEnter: `opacity ${tokens.duration.slow.var} ${tokens.easing.emphasized.var}`,
  backdrop: `opacity ${tokens.duration.slow.var} ${tokens.easing.standard.var}`,
  surfaceFast: `background-color ${tokens.duration.fast.var} ${tokens.easing.standard.var}`,
  colorShift: `color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, text-decoration-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
  controlSurface: `background-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}, border-color ${tokens.duration.medium.var} ${tokens.easing.standard.var}`,
} satisfies DesignTokens['transition'];

export const defaultBreakpointValues = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} satisfies DesignTokens['breakpoint'];

export const defaultZIndexValues = {
  base: 0,
  raised: 1,
  sticky: 10,
  dropdown: 100,
  overlay: 400,
  toast: 500,
  modal: 1000,
  max: 9999,
} satisfies DesignTokens['zIndex'];

/** Hue for dark chrome borders / shadow offset (aligned with soft dark field). */
const defaultDarkHue = 88;

/** Warm paper field (editorial / technical print). */
const defaultLightSubtle = tokens.palette['sand-2'].var;

export const defaultLightCodeValues: DesignTokens['color']['code'] = {
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

export const defaultDarkCodeValues: DesignTokens['color']['code'] = {
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

/** @deprecated Use `defaultLightCodeValues`. */
export const defaultLightSyntaxValues = defaultLightCodeValues;
/** @deprecated Use `defaultDarkCodeValues`. */
export const defaultDarkSyntaxValues = defaultDarkCodeValues;

/** Default light color tree — literals and `tokens.color.*` declare refs in one object. */
export const defaultLightColorValues = {
  background: {
    app: '#F5F1E9',
    surface: '#FAF8F2',
    subtle: defaultLightSubtle,
    elevated: '#FFFCF6',
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
    default: '#000',
    strong: '#000',
    focus: tokens.palette['blue-5'].var,
  },
  shadow: {
    offset: neoBrutalistShadowOffsetLight(defaultLightSubtle),
    color: `color-mix(in oklch, ${tokens.color.text.primary.var} 12%, transparent)`,
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
  code: defaultLightCodeValues,
} satisfies DesignTokens['color'];

/** Default dark color face — same declare-ref pattern as light. */
export const defaultDarkColorValues = {
  background: {
    /** Soft warm field — not ink-black; pairs with cream light mode. */
    app: colorUtil.oklch('23%', 0.012, 88),
    surface: colorUtil.oklch('27%', 0.011, 88),
    subtle: colorUtil.oklch('31%', 0.01, 88),
    elevated: colorUtil.oklch('27%', 0.011, 88),
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
    default: neoBrutalistBorderDarkDefault(defaultDarkHue),
    strong: neoBrutalistBorderDarkStrong(defaultDarkHue),
    focus: tokens.palette['blue-4'].var,
  },
  shadow: {
    offset: neoBrutalistShadowOffsetDark(defaultDarkHue),
    color: `color-mix(in oklch, ${tokens.color.text.primary.var} 12%, transparent)`,
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
  code: defaultDarkCodeValues,
} satisfies DesignTokens['color'];

/** Default values for every theme-overridable namespace (light color face). */
export const defaultTokenValues = {
  space: defaultSpaceValues,
  size: defaultSizeValues,
  opacity: defaultOpacityValues,
  letterSpacing: defaultLetterSpacingValues,
  radius: defaultRadiusValues,
  borderWidth: defaultBorderWidthValues,
  fontFamily: defaultFontFamilyValues,
  fontSize: defaultFontSizeValues,
  fontWeight: defaultFontWeightValues,
  lineHeight: defaultLineHeightValues,
  shadow: defaultShadowValues,
  duration: defaultDurationValues,
  easing: defaultEasingValues,
  transition: defaultTransitionValues,
  breakpoint: defaultBreakpointValues,
  zIndex: defaultZIndexValues,
  color: defaultLightColorValues,
} as const;
