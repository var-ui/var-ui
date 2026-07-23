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
} as const;

export const sizeValues = {
  control: { sm: '28px', md: '32px', lg: '36px' },
  icon: { sm: '14px', md: '16px', lg: '20px' },
} as const;

export const opacityValues = {
  disabled: '0.5',
  muted: '0.6',
} as const;

export const letterSpacingValues = {
  tight: '-0.015em',
  normal: '0',
  wide: '0.025em',
  caps: '0.06em',
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

export const shadowElevationValues = {
  low: '0 1px 2px color-mix(in oklch, var(--var-ui-color-text-primary) 8%, transparent)',
  med: '0 4px 12px color-mix(in oklch, var(--var-ui-color-text-primary) 12%, transparent)',
  high: '0 12px 32px color-mix(in oklch, var(--var-ui-color-text-primary) 16%, transparent)',
} as const;

export const shadowValues: Record<DesignShadowKeys, string> & {
  elevation: typeof shadowElevationValues;
} = {
  xs: '1px 1px 0 0 #000',
  sm: '2px 2px 0 0 #000',
  md: '3px 3px 0 0 #000',
  lg: '4px 4px 0 0 #000',
  xl: '5px 5px 0 0 #000',
  elevation: shadowElevationValues,
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
  thick: '2px',
} as const;
