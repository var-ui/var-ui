import { designTokens as t } from '../tokens';

/** Shared semantic keys: alert `info` maps to `accent`; badge `accent` / `tip` map here directly. */
export type SemanticToneKey = 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** Cross-component appearance axis (Mantine-style variants mapped to var-ui naming). */
export type ToneAppearance = 'filled' | 'outline' | 'subtle' | 'ghost';

/** Tint amounts for subtle surfaces (badge + alert `appearance: subtle`). */
export const subtleMix = {
  surface: '12%',
  border: '38%',
} as const;

export function subtleBackgroundColor(driver: string): string {
  return `color-mix(in srgb, ${driver} ${subtleMix.surface}, ${t.color.background.surface.var})`;
}

export function subtleBorderColor(driver: string): string {
  return `color-mix(in srgb, ${driver} ${subtleMix.border}, ${t.color.border.default.var})`;
}

export function filledHoverColor(solidBg: string): string {
  return `color-mix(in oklch, ${solidBg} 88%, black)`;
}

export const semanticTone = {
  accent: {
    semantic: t.color.accent.default.var,
    solidBg: t.color.accent.default.var,
    solidFg: t.color.text.onAccent.var,
  },
  success: {
    semantic: t.color.success.default.var,
    solidBg: t.color.success.solid.var,
    solidFg: t.color.text.onSuccess.var,
  },
  warning: {
    semantic: t.color.warning.default.var,
    solidBg: t.color.warning.default.var,
    solidFg: t.color.warning.onSolid.var,
  },
  danger: {
    semantic: t.color.danger.default.var,
    solidBg: t.color.danger.solid.var,
    solidFg: t.color.text.onDanger.var,
  },
  info: {
    semantic: t.color.info.default.var,
    solidBg: t.color.info.default.var,
    solidFg: t.color.text.onInfo.var,
  },
} as const satisfies Record<
  SemanticToneKey,
  { semantic: string; solidBg: string; solidFg: string }
>;

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
    [v.semantic.name]: ch.semantic,
    [v.solidBg.name]: ch.solidBg,
    [v.solidFg.name]: ch.solidFg,
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
          [v.background.name]: subtleBackgroundColor(v.semantic.var),
          [v.border.name]: v.semantic.var,
        },
      };
    case 'subtle':
      return {
        [v.border.name]: subtleBorderColor(v.semantic.var),
        [v.background.name]: subtleBackgroundColor(v.semantic.var),
        [v.foreground.name]: v.semantic.var,
        '&:hover': {
          [v.background.name]:
            `color-mix(in srgb, ${v.semantic.var} 18%, ${t.color.background.surface.var})`,
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

/**
 * Central tone × appearance resolver for bordered controls (button, badge, etc.).
 * Assigns border/background/foreground custom properties and hover recipes.
 */
export function tonePaint(v: TonePaintRefs, key: SemanticToneKey, appearance: ToneAppearance) {
  const ch = semanticTone[key];
  switch (appearance) {
    case 'filled':
      return {
        [v.border.name]: ch.solidBg,
        [v.background.name]: ch.solidBg,
        [v.foreground.name]: ch.solidFg,
        '&:hover': {
          [v.background.name]: filledHoverColor(ch.solidBg),
          [v.border.name]: filledHoverColor(ch.solidBg),
        },
      };
    case 'outline':
      return {
        [v.border.name]: ch.semantic,
        [v.background.name]: 'transparent',
        [v.foreground.name]: ch.semantic,
        '&:hover': {
          [v.background.name]: subtleBackgroundColor(ch.semantic),
          [v.border.name]: ch.semantic,
        },
      };
    case 'subtle':
      return {
        [v.border.name]: subtleBorderColor(ch.semantic),
        [v.background.name]: subtleBackgroundColor(ch.semantic),
        [v.foreground.name]: ch.semantic,
        '&:hover': {
          [v.background.name]:
            `color-mix(in srgb, ${ch.semantic} 18%, ${t.color.background.surface.var})`,
        },
      };
    case 'ghost':
      return {
        [v.border.name]: 'transparent',
        [v.background.name]: 'transparent',
        [v.foreground.name]: ch.semantic,
        '&:hover': {
          [v.background.name]: subtleBackgroundColor(ch.semantic),
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
        [v.borderColor.name]: ch.solidBg,
        [v.backgroundColor.name]: ch.solidBg,
        [v.textColor.name]: ch.solidFg,
      };
    case 'outline':
      return {
        [v.borderColor.name]: ch.semantic,
        [v.backgroundColor.name]: 'transparent',
        [v.textColor.name]: ch.semantic,
      };
    case 'subtle':
      return {
        [v.borderColor.name]: subtleBorderColor(ch.semantic),
        [v.backgroundColor.name]: subtleBackgroundColor(ch.semantic),
        [v.textColor.name]: ch.semantic,
      };
    case 'ghost':
      return {
        [v.borderColor.name]: 'transparent',
        [v.backgroundColor.name]: 'transparent',
        [v.textColor.name]: ch.semantic,
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
      ...(includeBorder ? { border: `1px solid ${v.solidBg.var}` } : {}),
    };
  }
  if (appearance === 'outline') {
    return {
      backgroundColor: 'transparent',
      color: t.color.text.primary.var,
      ...(includeBorder
        ? { border: `1px solid ${v.semantic.var}` }
        : { borderBlock: `1px solid ${v.semantic.var}` }),
    };
  }
  return {
    backgroundColor: subtleBackgroundColor(v.semantic.var),
    color: t.color.text.primary.var,
    ...(includeBorder
      ? { border: `1px solid ${subtleBorderColor(v.semantic.var)}` }
      : { borderBlock: `1px solid ${subtleBorderColor(v.semantic.var)}` }),
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
            borderColor: t.color.border.strong.var,
            backgroundColor: t.color.background.subtle.var,
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
