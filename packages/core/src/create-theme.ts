import type { ThemeOverrides } from 'typestyles';
import { registerExtendMap, type ExtendTokenValues } from './extend-tokens';
import { overrideComponent } from './override-component';
import { tokens } from './runtime';
import { themeableComponents } from './themeable-components';
import { defaultTokens } from './themes/default-values';
import { designTokens } from './tokens';
import type {
  DesignColorValues,
  DesignTheme,
  DesignThemeConfig,
  DesignThemeTokenValues,
} from './types';

/** Canonical attribute for fixed-tone subtrees (`data-surface="light"|"dark"`). */
export const SURFACE_ATTRIBUTE = 'data-surface';

type ExtendMap = Record<string, ExtendTokenValues>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Deep-merge plain objects; arrays and primitives from `patch` win. */
export function deepMergeThemeOverrides(
  base: ThemeOverrides,
  patch?: ThemeOverrides,
): ThemeOverrides {
  if (!patch) return structuredClone(base);

  const out: Record<string, unknown> = structuredClone(base);
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

function deepMergeColor(base: DesignColorValues, patch?: DeepPartialColor): DesignColorValues {
  return deepMergeThemeOverrides(
    { color: base } as ThemeOverrides,
    patch ? ({ color: patch } as ThemeOverrides) : undefined,
  ).color as DesignColorValues;
}

type DeepPartialColor = NonNullable<NonNullable<DesignThemeConfig['colorMode']>['light']>;

function omitColor(values: DesignThemeTokenValues): Omit<DesignThemeTokenValues, 'color'> {
  const { color: _color, ...rest } = values;
  return rest;
}

/**
 * Thin wrapper: merge a token pack + patches, compile ambient colorMode, append modes.
 * Optional `extend` registers custom tokens; optional `components` compiles to `styles.override`.
 */
export function createDesignTheme<const E extends ExtendMap = Record<string, never>>(
  config: DesignThemeConfig<E>,
): DesignTheme<E> {
  const { from, tokens: tokenOverrides, colorMode, modes, extend, components } = config;

  const extendResult = extend ? registerExtendMap(extend) : undefined;
  const mergedTokensRefs = {
    ...designTokens,
    ...(extendResult?.refs ?? {}),
  } as DesignTheme<E>['tokens'];

  const pack = from ?? defaultTokens;
  const mergedTokens = deepMergeThemeOverrides(
    pack.tokens as ThemeOverrides,
    (tokenOverrides ?? {}) as ThemeOverrides,
  ) as DesignThemeTokenValues;
  const lightColor = deepMergeColor(mergedTokens.color, colorMode?.light);
  const darkColor = deepMergeColor(pack.darkColor, colorMode?.dark);

  const base = {
    ...omitColor(mergedTokens),
    color: lightColor,
    ...(extendResult?.lightOverrides ?? {}),
  } as ThemeOverrides;

  const ambient = tokens.colorMode.systemWithLightDarkOverride({
    attribute: 'data-mode',
    values: { light: 'light', dark: 'dark' },
    scope: 'self',
    light: {
      color: lightColor,
      ...(extendResult?.lightOverrides ?? {}),
    } as ThemeOverrides,
    dark: {
      color: darkColor,
      ...(extendResult?.darkOverrides ?? {}),
    } as ThemeOverrides,
  });

  const theme = tokens.createTheme(config.name, {
    base,
    modes: [...ambient, ...(modes ?? [])],
  });

  if (components) {
    for (const [name, entry] of Object.entries(components)) {
      if (entry == null) continue;
      const overrideConfig = typeof entry === 'function' ? entry(mergedTokensRefs) : entry;
      const recipe = themeableComponents[name as keyof typeof themeableComponents];
      if (!recipe) continue;
      overrideComponent(recipe as object, overrideConfig, { theme });
    }
  }

  return Object.assign(theme, { tokens: mergedTokensRefs });
}
