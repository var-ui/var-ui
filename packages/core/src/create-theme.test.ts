import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme, SURFACE_ATTRIBUTE } from './create-theme';
import { defaultDarkValues, defaultLightValues } from './themes/default';

/** Runtime uses scopeId `example-ds` — theme classes are `theme-example-ds-<name>`. */
const themeClass = (name: string) => `.theme-example-ds-${name}`;

describe('createDesignTheme', () => {
  beforeEach(() => {
    reset();
  });

  it('emits descendant surface-dark rules when surfaces.dark is set', () => {
    createDesignTheme({
      name: 'surface-fixture',
      light: defaultLightValues,
      dark: defaultDarkValues,
      surfaces: { dark: defaultDarkValues },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('surface-fixture')} [${SURFACE_ATTRIBUTE}="dark"]`);
    expect(css).toMatch(/--example-ds-color-background-app:\s*oklch\(23%/);
  });

  it('omits surface rules when surfaces is omitted', () => {
    createDesignTheme({
      name: 'ambient-only',
      light: defaultLightValues,
      dark: defaultDarkValues,
    });

    const css = getRegisteredCss();
    expect(css).not.toContain(`[${SURFACE_ATTRIBUTE}="dark"]`);
    expect(css).not.toContain(`[${SURFACE_ATTRIBUTE}="light"]`);
    expect(css).toContain(`${themeClass('ambient-only')}[data-mode="dark"]`);
  });

  it('emits independent surface-light and surface-dark descendant rules', () => {
    createDesignTheme({
      name: 'both-surfaces',
      light: defaultLightValues,
      dark: defaultDarkValues,
      surfaces: {
        light: defaultLightValues,
        dark: defaultDarkValues,
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('both-surfaces')} [${SURFACE_ATTRIBUTE}="dark"]`);
    expect(css).toContain(`${themeClass('both-surfaces')} [${SURFACE_ATTRIBUTE}="light"]`);
    expect(css).toMatch(/--example-ds-color-background-app:\s*#F5F1E9/);
    expect(css).toMatch(/--example-ds-color-background-app:\s*oklch\(23%/);
  });
});
