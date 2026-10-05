import type { CreateTokenValues, OverrideConfigFor, ThemePreset, ThemeSurface } from 'typestyles';
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
  InferThemeExtendFromConfig,
} from '../types';
import type { ExtendTokenValues } from './extend-tokens';

type ExtendMap = Record<string, ExtendTokenValues>;

/** Default token + dark color base merged when `from` is omitted. */
const builtInPreset: DesignThemePreset = {
  tokens: tokenValues,
  colorMode: { dark },
};

function presetForTypeStyles(from: DesignThemePreset): ThemePreset {
  return {
    tokens: (from.tokens ?? {}) as Record<string, CreateTokenValues>,
    colorMode: from.colorMode,
    modes: from.modes,
  };
}

function themeSelectorPrefix(theme: Pick<ThemeSurface, 'className'>): string {
  return theme.className.startsWith('.') ? theme.className : `.${theme.className}`;
}

function attachDesignTheme<E extends ExtendMap>(surface: ThemeSurface<E>): DesignTheme<E> {
  const selectorPrefix = themeSelectorPrefix(surface);
  const tokens = (surface.tokens ?? designTokens) as DesignThemeTokens<E>;

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

  return Object.assign(surface, { tokens, componentStyles }) as DesignTheme<E>;
}

/**
 * Merge token overrides, ambient colorMode, optional custom namespaces, and compile a theme surface.
 * Delegates to TypeStyles `tokens.createTheme`; scoped recipe restyles use {@link DesignTheme.componentStyles}.
 */
export function createDesignTheme<const T extends DesignThemeConfig>(
  config: T,
): DesignTheme<InferThemeExtendFromConfig<T>> {
  const { from, tokens: tokenOverrides, colorMode, modes, fonts, name } = config;

  const preset = from ?? builtInPreset;
  for (const face of [...(preset.fonts ?? []), ...(fonts ?? [])]) {
    registerFontFace(face);
  }

  const surface = typestyles.tokens.createTheme({
    name,
    replace: true,
    from: presetForTypeStyles(preset),
    tokens: tokenOverrides as Record<string, CreateTokenValues> | undefined,
    colorMode,
    modes,
  });

  return attachDesignTheme(surface as ThemeSurface<InferThemeExtendFromConfig<T>>);
}

/**
 * Drop a runtime design theme surface (tokens + themed recipe overrides).
 * Avoid theme names where one is a prefix of another (e.g. `dark` and `dark-mode`) — TypeStyles
 * invalidation keys are prefix-based; prefer distinct names until upstream uses boundary-safe matching.
 */
export function disposeDesignTheme(name: string): void {
  typestyles.tokens.disposeTheme(name, { removeLiveCss: true });
}
