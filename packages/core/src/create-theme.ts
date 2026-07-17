import type { ThemeModeDefinition, ThemeOverrides } from 'typestyles';
import { registerExtendMap, type ExtendTokenValues } from './extend-tokens';
import { overrideComponent } from './override-component';
import { tokens } from './runtime';
import { themeableComponents } from './themeable-components';
import { defaultDarkValues, defaultLightValues } from './themes/default-values';
import { designTokens } from './tokens';
import type { DesignTheme, DesignThemeConfig } from './types';

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

/**
 * One place for the design-system palette pattern: `base` + shared `data-mode` / system
 * color mode, plus optional fixed-tone descendant surfaces via `SURFACE_ATTRIBUTE`.
 * Optional `extend` registers custom tokens; optional `components` (per-key object or
 * `(t) => override`) compiles to `styles.override`.
 *
 * `light` / `dark` (and surface faces) are deep-merged onto the built-in default palette,
 * so partial accent/border overrides do not need to spread `defaultLightValues`.
 */
export function createDesignTheme<const E extends ExtendMap = Record<string, never>>(
  config: DesignThemeConfig<E>,
): DesignTheme<E> {
  const { light, dark, surfaces, extend, components } = config;

  const extendResult = extend ? registerExtendMap(extend) : undefined;
  const mergedTokens = {
    ...designTokens,
    ...(extendResult?.refs ?? {}),
  } as DesignTheme<E>['tokens'];

  const lightMerged = deepMergeThemeOverrides(defaultLightValues, light);
  const darkMerged = deepMergeThemeOverrides(defaultDarkValues, dark);

  const lightWithExtend = (
    extendResult ? { ...lightMerged, ...extendResult.lightOverrides } : lightMerged
  ) as ThemeOverrides;
  const darkWithExtend = (
    extendResult ? { ...darkMerged, ...extendResult.darkOverrides } : darkMerged
  ) as ThemeOverrides;

  const ambientModes = tokens.colorMode.systemWithLightDarkOverride({
    attribute: 'data-mode',
    values: { light: 'light', dark: 'dark' },
    scope: 'self',
    light: lightWithExtend,
    dark: darkWithExtend,
  });

  const surfaceModes: ThemeModeDefinition[] = [];
  if (surfaces?.dark) {
    surfaceModes.push({
      id: 'surface-dark',
      overrides: deepMergeThemeOverrides(darkWithExtend, surfaces.dark),
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    });
  }
  if (surfaces?.light) {
    surfaceModes.push({
      id: 'surface-light',
      overrides: deepMergeThemeOverrides(lightWithExtend, surfaces.light),
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'light', { scope: 'descendant' }),
    });
  }

  const theme = tokens.createTheme(config.name, {
    base: lightWithExtend,
    modes: [...ambientModes, ...surfaceModes],
  });

  if (components) {
    for (const [name, entry] of Object.entries(components)) {
      if (entry == null) continue;
      const overrideConfig = typeof entry === 'function' ? entry(mergedTokens) : entry;
      const recipe = themeableComponents[name as keyof typeof themeableComponents];
      if (!recipe) continue;
      overrideComponent(recipe as object, overrideConfig, { theme });
    }
  }

  return Object.assign(theme, { tokens: mergedTokens });
}
