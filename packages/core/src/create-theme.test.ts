import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme, SURFACE_ATTRIBUTE } from './create-theme';
import { defaultDarkValues, defaultLightValues } from './themes/default';

/** Runtime uses scopeId `var-ui` — theme classes are `theme-var-ui-<name>`. */
const themeClass = (name: string) => `.theme-var-ui-${name}`;

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
    expect(css).toMatch(/--var-ui-color-background-app:\s*oklch\(23%/);
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
    expect(css).toMatch(/--var-ui-color-background-app:\s*#F5F1E9/);
    expect(css).toMatch(/--var-ui-color-background-app:\s*oklch\(23%/);
  });

  it('lets `data-mode="system"` fall through to the plain prefers-color-scheme rule', () => {
    createDesignTheme({
      name: 'system-fixture',
      light: defaultLightValues,
      dark: defaultDarkValues,
    });

    const css = getRegisteredCss();
    // Media-query-only dark rule with no attribute condition — governs whenever data-mode
    // is absent or set to a value (e.g. "system") that doesn't match the explicit overrides below.
    expect(css).toMatch(
      /@media \(prefers-color-scheme:\s*dark\)\s*{\s*\.theme-var-ui-system-fixture\s*{/,
    );
    // Explicit forced overrides only match "dark"/"light" — "system" matches neither.
    expect(css).toContain(`${themeClass('system-fixture')}[data-mode="dark"]`);
    expect(css).not.toContain(`${themeClass('system-fixture')}[data-mode="system"]`);
  });
});
