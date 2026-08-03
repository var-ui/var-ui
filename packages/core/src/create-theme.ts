import { applyThemeComponentOverrides } from './theme-component-overrides';
import { createDesignThemeBase, type ExtendMap } from './create-theme-base';
import type { DesignTheme, DesignThemeConfig } from './types';

/**
 * Merge token overrides + ambient colorMode, compile TypeStyles theme, append modes.
 * Optional `extend` registers custom tokens; optional `components` compiles to `styles.override`.
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
