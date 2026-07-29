import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme, DEFAULT_THEME_NAME, SURFACE_ATTRIBUTE } from '../src/create-theme';
import { extendTokens, resetExtendTokenRegistry } from '../src/extend-tokens';
import { resetRegisteredFontFaces } from '../src/fonts/register-font-face';
import { registerGlobals } from '../src/document-globals';
import { styles } from '../src/runtime';
import { button } from '../src/components/button';
import { badge } from '../src/components/badge';
import { designTokens } from '../src/tokens';

/** Runtime uses scopeId `var-ui` — theme classes are `theme-var-ui-<name>`. */
const themeClass = (name: string) => `.theme-var-ui-${name}`;

describe('createDesignTheme', () => {
  beforeEach(() => {
    reset();
    resetRegisteredFontFaces();
    resetExtendTokenRegistry();
    registerGlobals();
  });

  it('registers declared tokens with inheritable @property rules', async () => {
    const { vi } = await import('vite-plus/test');
    vi.resetModules();
    reset();
    registerGlobals();
    await import('../src/tokens/declare');
    const css = getRegisteredCss();
    expect(css).toContain(
      '@property --var-ui-fontSize-md { syntax: "<length-percentage>"; inherits: true;',
    );
  });

  it('emits dark color values via light-dark() on theme tokens', () => {
    createDesignTheme({
      name: 'color-only-dark',
      tokens: { fontSize: { md: '20px' } },
      colorMode: {
        dark: { accent: { default: '#ff0000', hover: '#cc0000' } },
      },
    });
    const css = getRegisteredCss();
    expect(css).toMatch(/--var-ui-color-accent-default:\s*light-dark\(/);
    expect(css).toContain('light-dark(');
    expect(css).toContain('#ff0000');
    expect(css).toContain('--var-ui-fontSize-md: 20px');
  });

  it('accepts token refs in tokens.color', () => {
    createDesignTheme({
      name: 'ref-accent',
      colorMode: {
        light: {
          accent: {
            default: designTokens.palette['sky-7'].var,
            hover: designTokens.palette['sky-8'].var,
          },
        },
      },
    });
    const css = getRegisteredCss();
    expect(css).toMatch(
      /--var-ui-color-accent-default:\s*light-dark\(var\(--var-ui-palette-sky-7\)/,
    );
  });

  it('sets color-scheme on the theme surface for light-dark() resolution', () => {
    createDesignTheme({
      name: 'with-surface',
    });
    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('with-surface')} { color-scheme: light dark`);
    expect(css).not.toContain(`${themeClass('with-surface')} [${SURFACE_ATTRIBUTE}="dark"]`);
  });

  it('does not emit surface color mode rules (surfaces use global color-scheme)', () => {
    createDesignTheme({
      name: 'ambient-only',
      surfaces: false,
    });

    const css = getRegisteredCss();
    expect(css).not.toContain(`${themeClass('ambient-only')} [${SURFACE_ATTRIBUTE}="dark"]`);
    expect(css).not.toContain(`${themeClass('ambient-only')}[data-mode="dark"]`);
    expect(css).toMatch(/--var-ui-color-accent-default:\s*light-dark\(/);
  });

  it('does not emit prefers-color-scheme color token rules on the theme class', () => {
    createDesignTheme({
      name: 'system-fixture',
    });

    const css = getRegisteredCss();
    expect(css).not.toMatch(
      /@media \(prefers-color-scheme:\s*dark\)\s*{\s*\.theme-var-ui-system-fixture\s*{/,
    );
    expect(css).not.toContain(`${themeClass('system-fixture')}[data-mode="dark"]`);
    expect(css).toMatch(/--var-ui-color-background-app:\s*light-dark\(/);
  });

  it('deep-merges partial colorMode onto the default preset with light-dark()', () => {
    createDesignTheme({
      name: 'partial-palette',
      colorMode: {
        light: {
          accent: {
            default: 'oklch(55% 0.2 290)',
            hover: 'oklch(48% 0.2 290)',
          },
        },
        dark: {
          accent: {
            default: 'oklch(72% 0.16 290)',
            hover: 'oklch(78% 0.14 290)',
          },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toMatch(
      /--var-ui-color-accent-default:\s*light-dark\(oklch\(55% 0\.2 290\), oklch\(72% 0\.16 290\)\)/,
    );
    expect(css).toMatch(
      /--var-ui-color-background-app:\s*light-dark\(var\(--var-ui-palette-neutral-1\)/,
    );
  });

  it('extendTokens registers light-dark() for color-compatible mode-aware leaves', () => {
    const brand = extendTokens('brand', {
      accent: {
        light: 'oklch(55% 0.2 290)',
        dark: 'oklch(72% 0.16 290)',
      },
      halo: 'radial-gradient(circle, red, transparent)',
    });

    expect(brand.accent).toBe('var(--var-ui-brand-accent)');
    expect(brand.halo).toBe('var(--var-ui-brand-halo)');

    const css = getRegisteredCss();
    expect(css).toMatch(
      /--var-ui-brand-accent:\s*light-dark\(oklch\(55% 0\.2 290\), oklch\(72% 0\.16 290\)\)/,
    );
    expect(css).toContain('--var-ui-brand-halo: radial-gradient(circle, red, transparent)');
    expect(css).not.toContain(':root[data-mode="dark"]');
  });

  it('extendTokens keeps dark override rules for shadow-like mode-aware leaves', () => {
    extendTokens('brand', {
      glow: {
        light: '0 0 0 3px oklch(90% 0.1 280)',
        dark: '0 0 16px oklch(70% 0.2 280)',
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-brand-glow: 0 0 0 3px oklch(90% 0.1 280)');
    expect(css).toContain(':root[data-mode="dark"]');
    expect(css).toContain('--var-ui-brand-glow: 0 0 16px oklch(70% 0.2 280)');
  });

  it('extend merges refs onto theme.tokens and scopes light-dark values', () => {
    const acme = createDesignTheme({
      name: 'acme-extend',
      extend: {
        brand: {
          accent: {
            light: 'blue',
            dark: 'navy',
          },
        },
      },
    });

    expect(acme.tokens.brand.accent).toBe('var(--var-ui-brand-accent)');
    expect(acme.tokens.color).toBeDefined();

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-extend')}`);
    expect(css).toMatch(/--var-ui-brand-accent:\s*light-dark\(blue, navy\)/);
  });

  it('components emits overrides under the theme class', () => {
    button({ intent: 'primary', size: 'md' });

    createDesignTheme({
      name: 'acme-components',
      components: {
        button: (t) => ({
          base: {
            borderRadius: t.radius.lg.var,
          },
          variants: {
            intent: {
              primary: { textTransform: 'uppercase' },
            },
          },
        }),
      },
    });

    const css = getRegisteredCss();
    expect(css).toMatch(/@layer overrides/);
    expect(css).toContain(`${themeClass('acme-components')} .var-ui-button`);
    expect(css).toContain('text-transform: uppercase');
  });

  it('components accepts plain objects and per-key factories', () => {
    button({ intent: 'primary', size: 'md' });
    badge({});

    createDesignTheme({
      name: 'acme-mixed',
      extend: {
        brand: {
          accent: { light: 'blue', dark: 'navy' },
        },
      },
      components: {
        button: (t) => ({
          base: { color: t.brand.accent },
        }),
        badge: {
          base: { borderRadius: '999px' },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-mixed')} .var-ui-button`);
    expect(css).toContain('color: var(--var-ui-brand-accent)');
    expect(css).toContain(`${themeClass('acme-mixed')} .var-ui-badge`);
    expect(css).toContain('border-radius: 999px');
  });

  it('styles.override without selectorPrefix applies globally in overrides layer', () => {
    button({ intent: 'secondary', size: 'sm' });
    styles.override(
      button,
      {
        base: { borderRadius: '999px' },
      },
      { layer: 'overrides' },
    );

    const css = getRegisteredCss();
    expect(css).toMatch(/@layer overrides \{[\s\S]*\.var-ui-button \{/);
    expect(css).toContain('border-radius: 999px');
  });

  describe('theme fonts', () => {
    beforeEach(() => {
      reset();
      resetRegisteredFontFaces();
      resetExtendTokenRegistry();
      registerGlobals();
    });

    it('registers fonts from config', () => {
      createDesignTheme({
        name: 'with-fonts',
        fonts: [
          {
            family: 'Space Grotesk',
            src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
            fontWeight: '300 700',
          },
        ],
      });

      const css = getRegisteredCss();
      expect(css).toContain('@font-face');
      expect(css).toContain('font-family: "Space Grotesk"');
    });

    it('merges fonts from preset then config', () => {
      const preset = {
        fonts: [
          {
            family: 'JetBrains Mono',
            src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
          },
        ],
      };

      createDesignTheme({
        name: 'merged-fonts',
        from: preset,
        fonts: [
          {
            family: 'Space Grotesk',
            src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
          },
        ],
      });

      const css = getRegisteredCss();
      expect(css).toContain('font-family: "JetBrains Mono"');
      expect(css).toContain('font-family: "Space Grotesk"');
    });

    describe('default theme', () => {
      beforeEach(() => {
        reset();
        resetRegisteredFontFaces();
        resetExtendTokenRegistry();
        registerGlobals();
      });

      it('does not register @font-face rules', () => {
        createDesignTheme({ name: DEFAULT_THEME_NAME });
        const css = getRegisteredCss();
        expect(css).not.toContain('@font-face');
      });
    });
  });
});
