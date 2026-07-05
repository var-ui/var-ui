import { tokens } from './runtime';
import type { DesignTheme, DesignThemeConfig } from './types';
import type { ThemeModeDefinition } from 'typestyles';

/** Canonical attribute for fixed-tone subtrees (`data-surface="light"|"dark"`). */
export const SURFACE_ATTRIBUTE = 'data-surface';

/**
 * One place for the design-system palette pattern: `base` + shared `data-mode` / system
 * color mode, plus optional fixed-tone descendant surfaces via `SURFACE_ATTRIBUTE`.
 */
export function createDesignTheme(config: DesignThemeConfig): DesignTheme {
  const { light, dark, surfaces } = config;

  const ambientModes = tokens.colorMode.systemWithLightDarkOverride({
    attribute: 'data-mode',
    values: { light: 'light', dark: 'dark' },
    scope: 'self',
    light,
    dark,
  });

  const surfaceModes: ThemeModeDefinition[] = [];
  if (surfaces?.dark) {
    surfaceModes.push({
      id: 'surface-dark',
      overrides: surfaces.dark,
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    });
  }
  if (surfaces?.light) {
    surfaceModes.push({
      id: 'surface-light',
      overrides: surfaces.light,
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'light', { scope: 'descendant' }),
    });
  }

  return tokens.createTheme(config.name, {
    base: light,
    modes: [...ambientModes, ...surfaceModes],
  });
}
