import type { ThemeModeDefinition, ThemeOverrides } from 'typestyles';
import { registerExtendMap, type ExtendTokenValues } from './extend-tokens';
import { overrideComponent } from './override-component';
import { typestyles } from './runtime';
import { themeableComponents } from './themeable-components';
import { defaultTokens } from './themes/default-pack';
import { designTokens } from './tokens';
import { tokens } from './tokens/declare';
import type {
  DesignTheme,
  DesignThemeConfig,
  DesignThemeTokenValues,
  DesignTokenPack,
} from './types';

/** Canonical attribute for fixed-tone subtrees (`data-surface="light"|"dark"`). */
export const SURFACE_ATTRIBUTE = 'data-surface';

type ExtendMap = Record<string, ExtendTokenValues>;

type ColorPatch = DesignTokenPack['darkColor'];

function surfaceModes(lightColor: ColorPatch, darkColor: ColorPatch): ThemeModeDefinition[] {
  return [
    {
      id: 'surface-dark',
      overrides: { color: darkColor },
      when: typestyles.tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', {
        scope: 'descendant',
      }),
    },
    {
      id: 'surface-light',
      overrides: { color: lightColor },
      when: typestyles.tokens.when.attr(SURFACE_ATTRIBUTE, 'light', {
        scope: 'descendant',
      }),
    },
  ];
}

/** Combine the registered token tree with optional `extend` namespace refs. */
function mergeDesignTokenRefs(extendRefs?: Record<string, unknown>): typeof tokens {
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
 * Thin wrapper: merge a token pack + patches, compile ambient colorMode, append modes.
 * Optional `extend` registers custom tokens; optional `components` compiles to `styles.override`.
 */
export function createDesignTheme<const E extends ExtendMap = Record<string, never>>(
  config: DesignThemeConfig<E>,
): DesignTheme<E> {
  const {
    from,
    tokens: tokenOverrides,
    colorMode,
    modes,
    surfaces = true,
    extend,
    components,
  } = config;

  const extendResult = extend ? registerExtendMap(extend) : undefined;
  const mergedTokensRefs = mergeDesignTokenRefs(extendResult?.refs) as DesignTheme<E>['tokens'];

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

  const ambient = typestyles.tokens.colorMode.systemWithLightDarkOverride({
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

  const theme = typestyles.tokens.createTheme(config.name, {
    base,
    modes: [...ambient, ...(surfaces ? surfaceModes(lightColor, darkColor) : []), ...(modes ?? [])],
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
