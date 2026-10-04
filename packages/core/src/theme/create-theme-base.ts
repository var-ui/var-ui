import type { OverrideConfigFor, ThemeOverrides, ThemePreset, ThemeSurface } from 'typestyles';
import { registerFontFace } from '../fonts/register-font-face';
import { styles, typestyles } from '../runtime';
import { designTokens } from '../tokens';
import { dark } from '../tokens/defaults/color';
import { tokenValues } from '../tokens/preset';
import type {
  DesignTheme,
  DesignThemeConfig,
  DesignThemePreset,
  DesignThemeTokens,
} from '../types';
import { extendTokens, type ExtendTokenValues, type TokenRefsOf } from './extend-tokens';

export { mergeThemeOverrides, mergeThemeOverrides as deepMergeThemeOverrides } from 'typestyles';

/** @internal Shared with theme typing for generic `extend` maps. */
export type ExtendMap = Record<string, ExtendTokenValues>;

/** Default token + dark color base merged when `from` is omitted. */
const builtInPreset: DesignThemePreset = {
  tokens: tokenValues,
  colorMode: { dark },
};

function presetFromDesign(from: DesignThemePreset): ThemePreset {
  return {
    base: (from.tokens ?? {}) as ThemeOverrides,
    colorMode: from.colorMode,
    modes: from.modes,
    extend: from.extend as ThemePreset['extend'],
  };
}

function extendRefsForConfig<E extends ExtendMap>(
  preset: DesignThemePreset,
  extend: E | undefined,
): TokenRefsOf<E> {
  const merged = { ...(preset.extend ?? {}), ...(extend ?? {}) } as E;
  const refs = {} as Record<string, unknown>;
  for (const [namespace, values] of Object.entries(merged) as Array<
    [keyof E & string, ExtendTokenValues]
  >) {
    refs[namespace] = extendTokens(namespace, values);
  }
  return refs as TokenRefsOf<E>;
}

function themeTokenRefs<E extends ExtendMap>(
  surface: ThemeSurface,
  extendRefs: TokenRefsOf<E>,
): DesignThemeTokens<E> {
  const base = designTokens as DesignThemeTokens<E>;
  const extendKeys = Object.keys(extendRefs);
  const fromSurface = surface.tokens as Record<string, unknown> | undefined;

  if (extendKeys.length === 0 && !fromSurface) {
    return base;
  }

  return new Proxy(base, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && prop in extendRefs) {
        return extendRefs[prop as keyof typeof extendRefs];
      }
      if (
        fromSurface &&
        typeof prop === 'string' &&
        prop !== 'use' &&
        prop in fromSurface &&
        !(prop in target)
      ) {
        return fromSurface[prop];
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as DesignThemeTokens<E>;
}

function themeSelectorPrefix(theme: ThemeSurface): string {
  return theme.className.startsWith('.') ? theme.className : `.${theme.className}`;
}

function attachDesignTheme<E extends ExtendMap>(
  theme: ThemeSurface,
  tokens: DesignThemeTokens<E>,
): DesignTheme<E> {
  const selectorPrefix = themeSelectorPrefix(theme);

  const componentStyles = <C>(
    component: C,
    config: OverrideConfigFor<C> | ((t: DesignThemeTokens<E>) => OverrideConfigFor<C>),
  ) => {
    const resolved = typeof config === 'function' ? config(tokens) : config;
    styles.override(component as never, resolved as never, {
      selectorPrefix,
      layer: 'overrides',
    });
  };

  return Object.assign(theme, { tokens, componentStyles }) as DesignTheme<E>;
}

function compileDesignTheme<const E extends ExtendMap = Record<string, never>>(
  config: DesignThemeConfig<E>,
): DesignTheme<E> {
  const { from, tokens: tokenOverrides, colorMode, modes, extend, fonts, name } = config;

  const preset = from ?? builtInPreset;
  for (const face of [...(preset.fonts ?? []), ...(fonts ?? [])]) {
    registerFontFace(face);
  }

  const extendRefs = extendRefsForConfig(preset, extend);

  const theme = typestyles.tokens.createTheme(
    name,
    {
      from: presetFromDesign(preset),
      patch: {
        base: (tokenOverrides ?? {}) as ThemeOverrides,
        colorMode,
        modes,
        extend: extend as ThemePreset['extend'],
      },
    },
    { replace: true },
  );

  return attachDesignTheme(theme, themeTokenRefs(theme, extendRefs));
}

/**
 * Merge token overrides, ambient colorMode, optional `extend`, and compile a theme surface.
 * Scoped recipe restyles use {@link DesignTheme.componentStyles} after creation.
 */
export function createDesignTheme<const E extends ExtendMap = Record<string, never>>(
  config: DesignThemeConfig<E>,
): DesignTheme<E> {
  return compileDesignTheme(config);
}

/** @deprecated Alias of {@link createDesignTheme}. */
export const createDesignThemeBase = createDesignTheme;

/** Drop a runtime design theme surface (tokens + themed recipe overrides). */
export function unregisterDesignTheme(name: string): void {
  typestyles.tokens.disposeTheme(name, { removeLiveCss: true });
}

export function disposeDesignTheme(name: string): void {
  unregisterDesignTheme(name);
}
