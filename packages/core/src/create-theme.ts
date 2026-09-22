import { applyThemeComponentOverrides } from './theme-component-overrides';
import { createDesignThemeBase, unregisterDesignTheme, type ExtendMap } from './create-theme-base';
import type { DesignTheme, DesignThemeConfig } from './types';

/**
 * Unregister a runtime design theme surface (tokens + themed recipe overrides).
 * Same `name` as `createDesignTheme`.
 */
export function disposeDesignTheme(name: string): void {
  unregisterDesignTheme(name);
}

/**
 * Merge token overrides + ambient colorMode, compile TypeStyles theme, append modes.
 * Optional `extend` registers custom tokens; optional `components` compiles to `styles.override`.
 * Calling again with the same `name` replaces the previous surface in place.
 */
export function createDesignTheme<const E extends ExtendMap = Record<string, never>>(
  config: DesignThemeConfig<E>,
): DesignTheme<E> {
  const { components, ...baseConfig } = config;
  const theme = createDesignThemeBase(baseConfig);

  if (components) {
    applyThemeComponentOverrides(components, theme.className, theme.tokens);
  }

  return theme;
}
