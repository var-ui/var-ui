import type { ThemeOverrides } from 'typestyles';
import { registerExtendMap, type ExtendTokenValues } from './extend-tokens';
import { registerFontFace } from './fonts/register-font-face';
import { styles, typestyles } from './runtime';
import { themeableComponents } from './themeable-components';
import { dark } from './tokens/defaults/color';
import { tokenValues } from './tokens/preset';
import { designTokens } from './tokens/declare';
import type {
  DesignColorValues,
  DesignTheme,
  DesignThemeConfig,
  DesignThemePreset,
  DesignThemeTokenValues,
} from './types';

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Plain clone for theme merges — stringify declare token refs (`var(--…)`) instead of structuredClone. */
function cloneForThemeMerge(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(cloneForThemeMerge);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = cloneForThemeMerge(child);
    }
    return out;
  }
  // Token refs stringify to `var(--…)`; plain objects should not reach this branch.
  // oxlint-disable-next-line typescript/no-base-to-string -- RegisteredPropertyRef
  return String(value);
}

/** Deep-merge plain objects; arrays and primitives from `patch` win. */
export function deepMergeThemeOverrides(
  base: ThemeOverrides,
  patch?: ThemeOverrides,
): ThemeOverrides {
  if (!patch) return cloneForThemeMerge(base) as ThemeOverrides;

  const out = cloneForThemeMerge(base) as Record<string, unknown>;
  for (const [key, patchValue] of Object.entries(patch)) {
    const baseValue = out[key];
    if (isPlainObject(baseValue) && isPlainObject(patchValue)) {
      out[key] = deepMergeThemeOverrides(baseValue as ThemeOverrides, patchValue as ThemeOverrides);
    } else {
      out[key] = patchValue;
    }
  }
  return out as ThemeOverrides;
}

function deepMergeColor(base: ColorPatch | undefined, patch?: ColorPatch): ColorPatch {
  return deepMergeThemeOverrides(
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
  const mergedTokens = deepMergeThemeOverrides(
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
    for (const [name, entry] of Object.entries(components)) {
      if (entry == null) continue;
      const overrideConfig = typeof entry === 'function' ? entry(mergedTokensRefs) : entry;
      const recipe = themeableComponents[name as keyof typeof themeableComponents];
      if (!recipe) continue;
      styles.override(recipe as never, overrideConfig as never, {
        selectorPrefix: `.${theme.className}`,
        layer: 'overrides',
      });
    }
  }

  return Object.assign(theme, { tokens: mergedTokensRefs });
}

/** Name of the built-in default theme surface registered on package load. */
export const DEFAULT_THEME_NAME = 'default';

/** Class name for the default theme surface (`createDesignTheme({ name: DEFAULT_THEME_NAME })`). */
export const defaultThemeClassName = `theme-var-ui-${DEFAULT_THEME_NAME}`;

createDesignTheme({ name: DEFAULT_THEME_NAME });
