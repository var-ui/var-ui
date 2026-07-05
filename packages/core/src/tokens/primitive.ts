import {
  expandDurationBand,
  generateGeometricScale,
  generateLinearScale,
} from 'typestyles/token-scale';

function zipPx<T extends string>(names: readonly T[], values: number[]): Record<T, `${number}px`> {
  return Object.fromEntries(names.map((name, index) => [name, `${values[index]}px`])) as Record<
    T,
    `${number}px`
  >;
}

export const spaceValues = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  8: '48px',
  12: '64px',
} as const;

// base: 4, multiplier: 0 — brutalist default; all scaled steps stay 0px.
const RADIUS_STEPS = [1, 2, 3, 4] as const;
const RADIUS_NAMES = ['sm', 'md', 'lg', 'xl'] as const;
const radiusScale = generateLinearScale({
  base: 4,
  multiplier: 0,
  steps: [...RADIUS_STEPS],
});

export const radiusValues = {
  none: '0',
  ...zipPx(RADIUS_NAMES, radiusScale),
  full: '0',
} as const;

export const fontFamilyValues = {
  /** Editorial display: page titles, hero, masthead. */
  display:
    '"Fraunces", "Iowan Old Style", "Apple Garamond", Baskerville, "Palatino Linotype", Palatino, Georgia, serif',
  /** UI, body, and data labels — monospace technical rhythm. */
  sans: '"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace',
} as const;

// base: 14 (md anchor), ratio: 1.2 — editorial monospace ladder; not a lossless
// match to the prior hand-picked values (11/13/14/16/20/24/30).
const FONT_SIZE_STEPS = [-2, -1, 0, 1, 2, 3, 4] as const;
const FONT_SIZE_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const fontSizeScale = generateGeometricScale({
  base: 14,
  ratio: 1.2,
  steps: [...FONT_SIZE_STEPS],
});

export const fontSizeValues = zipPx(FONT_SIZE_NAMES, fontSizeScale);

export const fontWeightValues = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeightValues = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.625',
} as const;

export type DesignShadowKeys = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DesignShadowValues = Record<DesignShadowKeys, string>;

export const shadowValues: DesignShadowValues = {
  xs: '1px 1px 0 0 #000',
  sm: '2px 2px 0 0 #000',
  md: '3px 3px 0 0 #000',
  lg: '4px 4px 0 0 #000',
  xl: '5px 5px 0 0 #000',
};

// ratio: 0.75, roundTo: 5 (TypeStyles default) — bands for motion recipes.
const fastBand = expandDurationBand({ base: 80, ratio: 0.75 });
const mediumBand = expandDurationBand({ base: 140, ratio: 0.75 });
const slowBand = expandDurationBand({ base: 220, ratio: 0.75 });

export const durationValues = {
  fast: '80ms',
  medium: '140ms',
  slow: '220ms',
  'fast-min': `${fastBand.min}ms`,
  'fast-max': `${fastBand.max}ms`,
  'medium-min': `${mediumBand.min}ms`,
  'medium-max': `${mediumBand.max}ms`,
  'slow-min': `${slowBand.min}ms`,
  'slow-max': `${slowBand.max}ms`,
} as const;

export const easingValues = {
  standard: 'ease',
  emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const transitionValues = {
  overlayFade:
    'opacity var(--duration-slow) var(--easing-standard), visibility var(--duration-slow) var(--easing-standard)',
  panelEnter: 'opacity var(--duration-slow) var(--easing-emphasized)',
  backdrop: 'opacity var(--duration-slow) var(--easing-standard)',
  surfaceFast: 'background-color var(--duration-fast) var(--easing-standard)',
  colorShift:
    'color var(--duration-medium) var(--easing-standard), text-decoration-color var(--duration-medium) var(--easing-standard)',
  controlSurface:
    'background-color var(--duration-medium) var(--easing-standard), border-color var(--duration-medium) var(--easing-standard)',
} as const;

export const borderWidthValues = {
  thin: '1px',
  default: '1px',
  thick: '1px',
} as const;

export type DesignSpaceValues = typeof spaceValues;
export type DesignRadiusValues = typeof radiusValues;
export type DesignBorderWidthValues = typeof borderWidthValues;
export type DesignFontFamilyValues = typeof fontFamilyValues;
export type DesignFontSizeValues = typeof fontSizeValues;
export type DesignFontWeightValues = typeof fontWeightValues;
export type DesignLineHeightValues = typeof lineHeightValues;
export type DesignDurationValues = typeof durationValues;
export type DesignEasingValues = typeof easingValues;
export type DesignTransitionValues = typeof transitionValues;

export type DesignPrimitiveValues = {
  space: DesignSpaceValues;
  radius: DesignRadiusValues;
  borderWidth: DesignBorderWidthValues;
  fontFamily: DesignFontFamilyValues;
  fontSize: DesignFontSizeValues;
  fontWeight: DesignFontWeightValues;
  lineHeight: DesignLineHeightValues;
  shadow: DesignShadowValues;
  duration: DesignDurationValues;
  easing: DesignEasingValues;
  transition: DesignTransitionValues;
};
