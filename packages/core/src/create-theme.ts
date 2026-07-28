import { mergeThemeOverrides, type ThemeOverrides } from 'typestyles';
import { registerExtendMap, type ExtendTokenValues } from './extend-tokens';
import { registerFontFace } from './fonts/register-font-face';
import { styles, typestyles } from './runtime';
import { themeableComponents, type ThemeableComponentName } from './themeable-components';
import { dark } from './tokens/defaults/color';
import { tokenValues } from './tokens/preset';
import { designTokens } from './tokens/declare';
import type {
  DesignColorValues,
  DesignTheme,
  DesignThemeConfig,
  DesignThemePreset,
  DesignThemeTokenValues,
  DesignThemeTokens,
  ThemeComponentsConfig,
} from './types';

export { mergeThemeOverrides, mergeThemeOverrides as deepMergeThemeOverrides } from 'typestyles';

/** Default token + dark color base merged when `from` is omitted. */
const builtInPreset: DesignThemePreset = {
  tokens: tokenValues,
  colorMode: { dark },
};

/** Canonical attribute for fixed-tone subtrees (`data-surface="light"|"dark"`). */
export const SURFACE_ATTRIBUTE = 'data-surface';

type ExtendMap = Record<string, ExtendTokenValues>;

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
 * Merge token overrides + ambient colorMode, compile TypeStyles theme, append modes.
 * Optional `extend` registers custom tokens; optional `components` compiles to `styles.override`.
 */
export function createDesignTheme<const E extends ExtendMap = Record<string, never>>(
  config: DesignThemeConfig<E>,
): DesignTheme<E> {
  const { from, tokens: tokenOverrides, colorMode, modes, extend, components, fonts } = config;

  const extendResult = extend ? registerExtendMap(extend) : undefined;
  const mergedTokensRefs = mergeDesignTokenRefs(extendResult?.refs) as DesignTheme<E>['tokens'];

  const preset = from ?? builtInPreset;
  const mergedFonts = [...(preset.fonts ?? []), ...(fonts ?? [])];
  for (const face of mergedFonts) {
    registerFontFace(face);
  }
  const mergedTokens = mergeThemeOverrides(
    (preset.tokens ?? {}) as ThemeOverrides,
    (tokenOverrides ?? {}) as ThemeOverrides,
  ) as DesignThemeTokenValues;

  const base = {
    ...omitColor(mergedTokens),
    color: mergedTokens.color,
    ...extendResult?.overrides,
  } as ThemeOverrides;

  const theme = typestyles.tokens.createTheme(config.name, {
    base,
    colorMode: {
      light: {
        color: deepMergeColor(preset.colorMode?.light, colorMode?.light),
      },
      dark: {
        color: deepMergeColor(preset.colorMode?.dark, colorMode?.dark),
      },
    },
    modes: modes ?? [],
  });

  if (components) {
    type Components = NonNullable<typeof components>;
    for (const name of Object.keys(components) as Array<keyof Components>) {
      const entry = components[name];
      if (entry == null) continue;
      applyThemeComponentOverride(name, entry, theme.className, mergedTokensRefs);
    }
  }

  return Object.assign(theme, { tokens: mergedTokensRefs });
}

function applyThemeComponentOverride<E extends ExtendMap, K extends ThemeableComponentName>(
  name: K,
  entry: NonNullable<ThemeComponentsConfig<DesignThemeTokens<E>>[K]>,
  className: string,
  tokenRefs: DesignTheme<E>['tokens'],
): void {
  const overrideConfig: unknown = typeof entry === 'function' ? entry(tokenRefs) : entry;
  // Registry iteration cannot correlate `name`, recipe, and override config for overload resolution.
  styles.override(themeableComponents[name] as never, overrideConfig as never, {
    selectorPrefix: `.${className}`,
    layer: 'overrides',
  });
}

/** Name of the built-in default theme surface registered on package load. */
export const DEFAULT_THEME_NAME = 'default';

/** Class name for the default theme surface (`createDesignTheme({ name: DEFAULT_THEME_NAME })`). */
export const defaultThemeClassName = `theme-var-ui-${DEFAULT_THEME_NAME}`;

createDesignTheme({ name: DEFAULT_THEME_NAME });
