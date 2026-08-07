import { color } from 'typestyles/color';
import { contrastRatio, generateRamp, parseColor } from 'typestyles/color-scale';
import { darkSyntaxValues, lightSyntaxValues } from './defaults/color';
import { paletteHue } from './defaults/color/palette';
import { buildToneFace } from './tone-face';
import type { DesignColorValues, DesignTokens } from './types';

export type NeutralStyle = 'neutral' | 'cool' | 'warm';
export type ColorContrast = 'standard' | 'high';

export type GenerateColorsInput = {
  accent: string;
  neutralStyle?: NeutralStyle;
  contrast?: ColorContrast;
};

export type GenerateColorsResult = {
  light: DesignColorValues;
  dark: DesignColorValues;
};

/**
 * Calibration notes (`#0064E0`, standard contrast, neutral style):
 * - Light `tone.accent.foreground` lands near palette `sky-7`; dark accent mirrors to ~`blue-4`.
 * - Hand-authored defaults use palette neutrals and soft elevation shadows — generated
 *   neutrals are ramp-based OKLCH from the accent hue.
 * - Dark `tone.danger.background` / `tone.success.background` use ramp step 7 (not mirrored)
 *   to keep `foregroundOnBackground` above 4.5:1.
 */
const ACCENT_CHROMA_MIN = 0.08;
const NEUTRAL_CHROMA = 0.015;
const SEMANTIC_CHROMA = {
  danger: 0.21,
  success: 0.19,
  warning: 0.17,
  info: 0.22,
} as const;

type Ramp = readonly string[];

const LIGHT_SLOTS = {
  background: {
    app: 1,
    surface: 1,
    subtle: 2,
    elevated: 1,
    popover: 1,
    muted: 2,
    secondary: 2,
    tertiary: 3,
  },
  text: { primary: 10, secondary: 7 },
  border: { default: 4, strong: 5, focus: 5, subtle: 2 },
  tone: {
    accent: { foreground: 7, background: 7, linkHover: 8 },
    danger: { foreground: 7, background: 8 },
    success: { foreground: 7, background: 8 },
    warning: { foreground: 7, background: 8 },
    info: { foreground: 7, background: 7 },
  },
} as const;

function rampAt(ramp: Ramp, step: number): string {
  return ramp[step - 1];
}

function mirrorStep(step: number): number {
  return 11 - step;
}

function resolveNeutralHue(style: NeutralStyle, accentHue: number): number {
  if (style === 'cool') return 250;
  if (style === 'warm') return 70;
  return accentHue;
}

function resolveLightnessRange(contrast: ColorContrast): [number, number] {
  return contrast === 'high' ? [12, 99] : [22, 97];
}

function buildToneFaces(
  neutral: Ramp,
  accent: Ramp,
  danger: Ramp,
  success: Ramp,
  warning: Ramp,
  info: Ramp,
  mode: 'light' | 'dark',
): DesignTokens['color']['tone'] {
  const m = mode === 'light' ? (step: number) => step : mirrorStep;
  const slots = LIGHT_SLOTS.tone;
  const onFilledFallback = rampAt(neutral, 10);

  const accentForeground = rampAt(accent, m(slots.accent.foreground));
  const accentBackground = rampAt(accent, m(slots.accent.background));

  const dangerForeground = rampAt(danger, m(slots.danger.foreground));
  const dangerBackground =
    mode === 'light' ? rampAt(danger, slots.danger.background) : rampAt(danger, 7);

  const successForeground = rampAt(success, m(slots.success.foreground));
  const successBackground =
    mode === 'light' ? rampAt(success, slots.success.background) : rampAt(success, 7);

  const warningForeground = rampAt(warning, m(slots.warning.foreground));
  const warningBackground = rampAt(warning, m(slots.warning.background));

  const infoForeground = rampAt(info, m(slots.info.foreground));
  const infoBackground = rampAt(info, m(slots.info.background));

  return {
    accent: buildToneFace({
      foreground: accentForeground,
      background: accentBackground,
      onFilledFallback: onFilledFallback,
    }),
    danger: buildToneFace({
      foreground: dangerForeground,
      background: dangerBackground,
      onFilledFallback: onFilledFallback,
    }),
    success: buildToneFace({
      foreground: successForeground,
      background: successBackground,
      onFilledFallback: onFilledFallback,
    }),
    warning: buildToneFace({
      foreground: warningForeground,
      background: warningBackground,
      onFilledFallback: onFilledFallback,
    }),
    info: buildToneFace({
      foreground: infoForeground,
      background: infoBackground,
      onFilledFallback: onFilledFallback,
    }),
  };
}

function mapLightColors(
  neutral: Ramp,
  accent: Ramp,
  danger: Ramp,
  success: Ramp,
  warning: Ramp,
  info: Ramp,
) {
  const slots = LIGHT_SLOTS;
  const background = {
    app: rampAt(neutral, slots.background.app),
    surface: rampAt(neutral, slots.background.surface),
    subtle: rampAt(neutral, slots.background.subtle),
    elevated: rampAt(neutral, slots.background.elevated),
    popover: rampAt(neutral, slots.background.popover),
    muted: rampAt(neutral, slots.background.muted),
    secondary: rampAt(neutral, slots.background.secondary),
    tertiary: rampAt(neutral, slots.background.tertiary),
  };

  const accentForeground = rampAt(accent, slots.tone.accent.foreground);

  return {
    background,
    text: {
      primary: rampAt(neutral, slots.text.primary),
      secondary: rampAt(neutral, slots.text.secondary),
    },
    tone: buildToneFaces(neutral, accent, danger, success, warning, info, 'light'),
    border: {
      default: rampAt(neutral, slots.border.default),
      strong: rampAt(neutral, slots.border.strong),
      focus: rampAt(accent, slots.border.focus),
      subtle: rampAt(neutral, slots.border.subtle),
    },
    overlay: {
      default: color.alpha(rampAt(neutral, 10), 0.55, 'oklch'),
      panel: background.elevated,
    },
    link: {
      default: accentForeground,
      hover: rampAt(accent, slots.tone.accent.linkHover),
    },
    code: lightSyntaxValues,
  };
}

function mapDarkColors(
  neutral: Ramp,
  accent: Ramp,
  danger: Ramp,
  success: Ramp,
  warning: Ramp,
  info: Ramp,
) {
  const m = mirrorStep;
  const slots = LIGHT_SLOTS;
  const background = {
    app: rampAt(neutral, m(slots.background.app)),
    surface: rampAt(neutral, m(slots.background.surface)),
    subtle: rampAt(neutral, m(slots.background.subtle)),
    elevated: rampAt(neutral, m(slots.background.elevated)),
    popover: rampAt(neutral, m(slots.background.popover)),
    muted: rampAt(neutral, m(slots.background.muted)),
    secondary: rampAt(neutral, m(slots.background.secondary)),
    tertiary: rampAt(neutral, m(slots.background.tertiary)),
  };

  const accentForeground = rampAt(accent, m(slots.tone.accent.foreground));

  return {
    background,
    text: {
      primary: rampAt(neutral, m(slots.text.primary)),
      secondary: rampAt(neutral, m(slots.text.secondary)),
    },
    tone: buildToneFaces(neutral, accent, danger, success, warning, info, 'dark'),
    border: {
      default: rampAt(neutral, m(slots.border.default)),
      strong: rampAt(neutral, m(slots.border.strong)),
      focus: rampAt(accent, m(slots.border.focus)),
      subtle: rampAt(neutral, m(slots.border.subtle)),
    },
    overlay: {
      default: color.alpha(rampAt(neutral, m(10)), 0.7, 'oklch'),
      panel: background.elevated,
    },
    link: {
      default: accentForeground,
      hover: rampAt(accent, m(slots.tone.accent.linkHover)),
    },
    code: darkSyntaxValues,
  };
}

type ContrastPair = readonly [label: string, foreground: string, background: string];

function scalarTokenValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object' && 'var' in value) {
    const tokenVar = (value as { var: unknown }).var;
    if (typeof tokenVar === 'string') return tokenVar;
  }
  return '';
}

function asColorString(value: DesignTokens['color']['text']['primary']): string {
  return scalarTokenValue(value);
}

type GeneratedColorFace = ReturnType<typeof mapLightColors>;

function validateContrast(
  mode: 'light' | 'dark',
  colors: GeneratedColorFace,
  threshold: number,
): void {
  if (process.env.NODE_ENV === 'production') return;

  const pairs: ContrastPair[] = [
    [
      'text.primary / background.app',
      asColorString(colors.text.primary),
      asColorString(colors.background.app),
    ],
    [
      'text.secondary / background.app',
      asColorString(colors.text.secondary),
      asColorString(colors.background.app),
    ],
    [
      'tone.accent.foregroundOnBackground / tone.accent.background',
      asColorString(colors.tone.accent.foregroundOnBackground),
      asColorString(colors.tone.accent.background),
    ],
    [
      'tone.danger.foregroundOnBackground / tone.danger.background',
      asColorString(colors.tone.danger.foregroundOnBackground),
      asColorString(colors.tone.danger.background),
    ],
  ];

  for (const [label, foreground, background] of pairs) {
    if (contrastRatio(foreground, background) < threshold) {
      console.warn(
        `[design-system] generateColors (${mode}): contrast below ${threshold} for ${label}.`,
      );
    }
  }
}

export function generateColors(input: GenerateColorsInput): GenerateColorsResult {
  const neutralStyle = input.neutralStyle ?? 'neutral';
  const contrast = input.contrast ?? 'standard';
  const lightnessRange = resolveLightnessRange(contrast);
  const contrastThreshold = contrast === 'high' ? 7 : 4.5;

  const accentOklch = parseColor(input.accent);
  const neutralHue = resolveNeutralHue(neutralStyle, accentOklch.h);
  const accentChroma = Math.max(accentOklch.c, ACCENT_CHROMA_MIN);

  const rampOpts = { lightnessRange } as const;
  const neutralRamp = generateRamp({ hue: neutralHue, chroma: NEUTRAL_CHROMA, ...rampOpts });
  const accentRamp = generateRamp({ hue: accentOklch.h, chroma: accentChroma, ...rampOpts });
  const dangerRamp = generateRamp({
    hue: paletteHue.red,
    chroma: SEMANTIC_CHROMA.danger,
    ...rampOpts,
  });
  const successRamp = generateRamp({
    hue: paletteHue.green,
    chroma: SEMANTIC_CHROMA.success,
    ...rampOpts,
  });
  const warningRamp = generateRamp({
    hue: paletteHue.amber,
    chroma: SEMANTIC_CHROMA.warning,
    ...rampOpts,
  });
  const infoRamp = generateRamp({
    hue: paletteHue.blue,
    chroma: SEMANTIC_CHROMA.info,
    ...rampOpts,
  });

  const light = mapLightColors(
    neutralRamp,
    accentRamp,
    dangerRamp,
    successRamp,
    warningRamp,
    infoRamp,
  );
  const dark = mapDarkColors(
    neutralRamp,
    accentRamp,
    dangerRamp,
    successRamp,
    warningRamp,
    infoRamp,
  );

  validateContrast('light', light, contrastThreshold);
  validateContrast('dark', dark, contrastThreshold);

  return { light, dark };
}
