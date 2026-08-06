import { designTokens as t } from '../tokens';
import type { ToneKey } from '../tokens/schema/color/tone';

/** Shared semantic keys: alert `info` maps to `accent`; badge `accent` / `tip` map here directly. */
export type SemanticToneKey = ToneKey;

/** Cross-component appearance axis (Mantine-style variants mapped to var-ui naming). */
export type ToneAppearance = 'filled' | 'outline' | 'subtle' | 'ghost';

/** Default subtle tint (matches `tone.*.subtleBackground` token generation). */
export const subtleMix = {
  surface: '12%',
  border: '38%',
} as const;

/** Stronger tint for outline hover (appears from transparent). */
export const subtleHoverMix = {
  surface: '18%',
} as const;

export function filledHoverColor(background: string): string {
  return `color-mix(in oklch, ${background} 88%, black)`;
}

export function subtleBackgroundColor(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleMix.surface}, ${t.color.background.surface.var})`;
}

export function subtleBorderColor(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleMix.border}, ${t.color.border.default.var})`;
}

/** Darken an existing subtle wash — mirrors filled hover (mix toward black). */
export function subtleHoverBackground(foreground: string): string {
  return `color-mix(in oklch, ${subtleBackgroundColor(foreground)} 88%, black)`;
}

/** Tint used when outline/ghost surfaces pick up a subtle fill on hover. */
export function subtleHoverTint(foreground: string): string {
  return `color-mix(in srgb, ${foreground} ${subtleHoverMix.surface}, ${t.color.background.surface.var})`;
}

function isNeutralSemantic(semanticVar: string): boolean {
  return semanticVar === t.color.text.primary.var;
}

function toneChannels(key: SemanticToneKey) {
  const tone = t.color.tone[key];
  return {
    foreground: tone.foreground.var,
    background: tone.background.var,
    foregroundOnBackground: tone.foregroundOnBackground.var,
    subtleBackground: tone.subtleBackground.var,
    border: tone.border.var,
  };
}

export const semanticTone = {
  accent: toneChannels('accent'),
  success: toneChannels('success'),
  warning: toneChannels('warning'),
  danger: toneChannels('danger'),
  info: toneChannels('info'),
} as const;

type SemanticChannelRefs = {
  semantic: { name: string };
  solidBg: { name: string };
  solidFg: { name: string };
};

type ControlChannelRefs = {
  semantic: { name: string; var: string };
  solidBg: { name: string; var: string };
  solidFg: { name: string; var: string };
};

type TonePaintRefs = {
  border: { name: string };
  background: { name: string };
  foreground: { name: string };
};

type ControlPaintRefs = TonePaintRefs & ControlChannelRefs;

type BadgePaintRefs = {
  borderColor: { name: string };
  backgroundColor: { name: string };
  textColor: { name: string };
};

type SurfacePaintRefs = {
  semantic: { var: string };
  solidBg: { var: string };
  solidFg: { var: string };
};

/** Surface appearances for multi-slot components (alert, banner, toast). */
export type SurfaceAppearance = 'subtle' | 'solid' | 'outline';

/** Shared tone for banner, toast, and other feedback surfaces (no neutral/tip). */
export type FeedbackTone = 'info' | 'success' | 'warning' | 'danger';

export type ButtonTone = SemanticToneKey | 'neutral';

/** Shared sm/md/lg size axis for controls (button, spinner, drawer, etc.). */
export type ControlSize = 'sm' | 'md' | 'lg';

/** Spinner fill weight (distinct from `SurfaceAppearance`). */
export type SpinnerAppearance = 'solid' | 'subtle';

/** Progress bar fill weight. */
export type ProgressBarAppearance = 'solid' | 'subtle';

/** Progress bar tone axis (no `info`). */
export type ProgressBarTone = Exclude<SemanticToneKey, 'info'>;

/** Root custom properties for alert `tone` (solid + inherited semantic for subtle / title). */
export function semanticChannelAssignments(v: SemanticChannelRefs, key: SemanticToneKey) {
  const ch = semanticTone[key];
  return {
    [v.semantic.name]: ch.foreground,
    [v.solidBg.name]: ch.background,
    [v.solidFg.name]: ch.foregroundOnBackground,
  };
}

/** Neutral tone channels for button, badge, and other controls. */
export function neutralChannelAssignments(v: SemanticChannelRefs) {
  return {
    [v.semantic.name]: t.color.text.primary.var,
    [v.solidBg.name]: t.color.text.primary.var,
    [v.solidFg.name]: t.color.background.surface.var,
  };
}

/**
 * Applies `appearance` to border/background/foreground using channel vars set by `tone`.
 * Used by button (and any control sharing the same var layout as badge).
 */
export function controlAppearancePaint(v: ControlPaintRefs, appearance: ToneAppearance) {
  switch (appearance) {
    case 'filled':
      return {
        [v.border.name]: v.solidBg.var,
        [v.background.name]: v.solidBg.var,
        [v.foreground.name]: v.solidFg.var,
        '&:hover': {
          [v.background.name]: filledHoverColor(v.solidBg.var),
          [v.border.name]: filledHoverColor(v.solidBg.var),
        },
      };
    case 'outline':
      return {
        [v.border.name]: v.semantic.var,
        [v.background.name]: 'transparent',
        [v.foreground.name]: v.semantic.var,
        '&:hover': {
          [v.background.name]: subtleHoverTint(v.semantic.var),
          [v.border.name]: v.semantic.var,
        },
      };
    case 'subtle':
      if (isNeutralSemantic(v.semantic.var)) {
        return {
          [v.border.name]: t.color.border.default.var,
          [v.background.name]: t.color.background.surface.var,
          [v.foreground.name]: v.semantic.var,
          '&:hover': {
            [v.border.name]: t.color.border.strong.var,
          },
        };
      }
      return {
        [v.border.name]: subtleBorderColor(v.semantic.var),
        [v.background.name]: subtleBackgroundColor(v.semantic.var),
        [v.foreground.name]: v.semantic.var,
        '&:hover': {
          [v.border.name]: v.semantic.var,
        },
      };
    case 'ghost':
      return {
        [v.border.name]: 'transparent',
        [v.background.name]: 'transparent',
        [v.foreground.name]: v.semantic.var,
        '&:hover': {
          [v.background.name]: subtleBackgroundColor(v.semantic.var),
        },
      };
  }
}

/** Resolve tokenized subtle background from a tone foreground channel var. */
function toneSubtleBackgroundFor(foregroundVar: string): string {
  for (const key of Object.keys(semanticTone) as SemanticToneKey[]) {
    const ch = semanticTone[key];
    if (ch.foreground === foregroundVar) return ch.subtleBackground;
  }
  return subtleBackgroundColor(foregroundVar);
}

/** Resolve tokenized border from a tone foreground channel var. */
function toneBorderFor(foregroundVar: string): string {
  for (const key of Object.keys(semanticTone) as SemanticToneKey[]) {
    const ch = semanticTone[key];
    if (ch.foreground === foregroundVar) return ch.border;
  }
  return foregroundVar;
}

/**
 * Central tone × appearance resolver for bordered controls (button, badge, etc.).
 * Assigns border/background/foreground custom properties and hover recipes.
 */
export function tonePaint(v: TonePaintRefs, key: SemanticToneKey, appearance: ToneAppearance) {
  const ch = semanticTone[key];
  switch (appearance) {
    case 'filled':
      return {
        [v.border.name]: ch.background,
        [v.background.name]: ch.background,
        [v.foreground.name]: ch.foregroundOnBackground,
        '&:hover': {
          [v.background.name]: filledHoverColor(ch.background),
          [v.border.name]: filledHoverColor(ch.background),
        },
      };
    case 'outline':
      return {
        [v.border.name]: ch.foreground,
        [v.background.name]: 'transparent',
        [v.foreground.name]: ch.foreground,
        '&:hover': {
          [v.background.name]: ch.subtleBackground,
          [v.border.name]: ch.foreground,
        },
      };
    case 'subtle':
      return {
        [v.border.name]: subtleBorderColor(ch.foreground),
        [v.background.name]: subtleBackgroundColor(ch.foreground),
        [v.foreground.name]: ch.foreground,
        '&:hover': {
          [v.border.name]: ch.foreground,
        },
      };
    case 'ghost':
      return {
        [v.border.name]: 'transparent',
        [v.background.name]: 'transparent',
        [v.foreground.name]: ch.foreground,
        '&:hover': {
          [v.background.name]: subtleBackgroundColor(ch.foreground),
        },
      };
  }
}

/** Flat badge paint from tone + appearance (neutral uses token defaults when tone is unset). */
export function badgeTonePaint(
  v: BadgePaintRefs,
  key: SemanticToneKey,
  appearance: ToneAppearance = 'subtle',
) {
  const ch = semanticTone[key];
  switch (appearance) {
    case 'filled':
      return {
        [v.borderColor.name]: ch.background,
        [v.backgroundColor.name]: ch.background,
        [v.textColor.name]: ch.foregroundOnBackground,
      };
    case 'outline':
      return {
        [v.borderColor.name]: ch.foreground,
        [v.backgroundColor.name]: 'transparent',
        [v.textColor.name]: ch.foreground,
      };
    case 'subtle':
      return {
        [v.borderColor.name]: ch.border,
        [v.backgroundColor.name]: ch.subtleBackground,
        [v.textColor.name]: ch.foreground,
      };
    case 'ghost':
      return {
        [v.borderColor.name]: 'transparent',
        [v.backgroundColor.name]: 'transparent',
        [v.textColor.name]: ch.foreground,
      };
  }
}

/** Multi-slot surface paint for alert/banner/toast `appearance` (reads vars set by `tone`). */
export function appearanceSurface(
  v: SurfacePaintRefs,
  appearance: SurfaceAppearance,
  options?: { includeBorder?: boolean },
) {
  const includeBorder = options?.includeBorder ?? true;
  if (appearance === 'solid') {
    return {
      backgroundColor: v.solidBg.var,
      color: v.solidFg.var,
      ...(includeBorder
        ? {
            borderWidth: t.borderWidth.default.var,
            borderStyle: 'solid',
            borderColor: v.solidBg.var,
          }
        : {}),
    };
  }
  if (appearance === 'outline') {
    return {
      backgroundColor: 'transparent',
      color: t.color.text.primary.var,
      ...(includeBorder
        ? {
            borderWidth: t.borderWidth.default.var,
            borderStyle: 'solid',
            borderColor: v.semantic.var,
          }
        : {
            borderBlockWidth: t.borderWidth.default.var,
            borderBlockStyle: 'solid',
            borderBlockColor: v.semantic.var,
          }),
    };
  }
  const subtleBg = toneSubtleBackgroundFor(v.semantic.var);
  const subtleBorder = toneBorderFor(v.semantic.var);
  return {
    backgroundColor: subtleBg,
    color: t.color.text.primary.var,
    ...(includeBorder
      ? {
          borderWidth: t.borderWidth.default.var,
          borderStyle: 'solid',
          borderColor: subtleBorder,
        }
      : {
          borderBlockWidth: t.borderWidth.default.var,
          borderBlockStyle: 'solid',
          borderBlockColor: subtleBorder,
        }),
  };
}

/** Button paint including the neutral tone (not in the semantic palette). */
export function buttonTonePaint(v: TonePaintRefs, tone: ButtonTone, appearance: ToneAppearance) {
  if (tone === 'neutral') {
    switch (appearance) {
      case 'filled':
        return {
          [v.border.name]: t.color.text.primary.var,
          [v.background.name]: t.color.text.primary.var,
          [v.foreground.name]: t.color.background.surface.var,
          '&:hover': {
            [v.background.name]: `color-mix(in oklch, ${t.color.text.primary.var} 88%, black)`,
            [v.border.name]: `color-mix(in oklch, ${t.color.text.primary.var} 88%, black)`,
          },
        };
      case 'outline':
        return {
          [v.border.name]: t.color.border.strong.var,
          [v.background.name]: 'transparent',
          [v.foreground.name]: t.color.text.primary.var,
          '&:hover': {
            backgroundColor: t.color.background.subtle.var,
          },
        };
      case 'subtle':
        return {
          [v.border.name]: t.color.border.default.var,
          [v.background.name]: t.color.background.surface.var,
          [v.foreground.name]: t.color.text.primary.var,
          '&:hover': {
            [v.border.name]: t.color.border.strong.var,
          },
        };
      case 'ghost':
        return {
          [v.border.name]: 'transparent',
          [v.background.name]: 'transparent',
          [v.foreground.name]: t.color.text.primary.var,
          '&:hover': {
            backgroundColor: t.color.background.subtle.var,
          },
        };
    }
  }
  return tonePaint(v, tone, appearance);
}
