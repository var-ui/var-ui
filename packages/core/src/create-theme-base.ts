import { mergeThemeOverrides, type ThemeOverrides } from 'typestyles';
import { registerExtendMap, type ExtendTokenValues } from './extend-tokens';
import { registerFontFace } from './fonts/register-font-face';
import { typestyles } from './runtime';
import { dark } from './tokens/defaults/color';
import { tokenValues } from './tokens/preset';
import { designTokens } from './tokens/declare';
import { splitModeAwareColorValues } from './split-mode-aware-colors';
import type {
  DesignColorValues,
  DesignTheme,
  DesignThemeConfig,
  DesignThemePreset,
  DesignThemeTokenValues,
  DesignThemeTokens,
} from './types';

export { mergeThemeOverrides, mergeThemeOverrides as deepMergeThemeOverrides } from 'typestyles';

/** @internal Shared with theme-component-overrides for generic theme config typing. */
export type ExtendMap = Record<string, ExtendTokenValues>;

/** Default token + dark color base merged when `from` is omitted. */
const builtInPreset: DesignThemePreset = {
  tokens: tokenValues,
  colorMode: { dark },
};

type ColorPatch = DesignColorValues;

/** Combine the registered token tree with optional `extend` namespace refs. */
function mergeDesignTokenRefs(extendRefs?: Record<string, unknown>): typeof designTokens {
  if (!extendRefs || Object.keys(extendRefs).length === 0) return designTokens;
  return new Proxy(designTokens, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && prop in extendRefs) {
        return extendRefs[prop];
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

function deepMergeColor(base: ColorPatch | undefined, patch?: ColorPatch): ColorPatch {
  return mergeThemeOverrides(
    { color: base ?? {} } as ThemeOverrides,
    patch ? ({ color: patch } as ThemeOverrides) : undefined,
  ).color as ColorPatch;
}

function omitColor(values: DesignThemeTokenValues): Omit<DesignThemeTokenValues, 'color'> {
  const { color: _color, ...rest } = values;
  return rest;
}

/**
 * Merge token overrides + ambient colorMode and compile a TypeStyles theme surface.
 * Does not apply per-recipe `components` overrides — use {@link createDesignTheme} for that.
 */
export function createDesignThemeBase<const E extends ExtendMap = Record<string, never>>(
  config: Omit<DesignThemeConfig<E>, 'components'>,
): DesignTheme<E> {
  const { from, tokens: tokenOverrides, colorMode, modes, extend, fonts } = config;

  const extendResult = extend ? registerExtendMap(extend) : undefined;
  const mergedTokensRefs = mergeDesignTokenRefs(extendResult?.refs) as DesignThemeTokens<E>;

  const preset = from ?? builtInPreset;
  const mergedFonts = [...(preset.fonts ?? []), ...(fonts ?? [])];
  for (const face of mergedFonts) {
    registerFontFace(face);
  }
  const mergedTokens = mergeThemeOverrides(
    (preset.tokens ?? {}) as ThemeOverrides,
    (tokenOverrides ?? {}) as ThemeOverrides,
  ) as DesignThemeTokenValues;

  const { base: baseColor, darkPatch: inlineDarkColorPatch } = splitModeAwareColorValues(
    mergedTokens.color,
  );

  const base = {
    ...omitColor(mergedTokens),
    color: baseColor,
    ...extendResult?.overrides,
  } as ThemeOverrides;

  const theme = typestyles.tokens.createTheme(config.name, {
    base,
    colorMode: {
      light: {
        color: deepMergeColor(preset.colorMode?.light, colorMode?.light),
      },
      dark: {
        color: deepMergeColor(
          deepMergeColor(preset.colorMode?.dark, inlineDarkColorPatch),
          colorMode?.dark,
        ),
      },
    },
    modes: modes ?? [],
  });

  return Object.assign(theme, { tokens: mergedTokensRefs });
}
