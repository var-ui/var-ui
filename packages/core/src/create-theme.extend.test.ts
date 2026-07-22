import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme } from './create-theme';
import { extendTokens, resetExtendTokenRegistry } from './extend-tokens';
import { overrideComponent } from './override-component';
import { button } from './components/button';
import { badge } from './components/badge';
import { defaultTokens } from './themes/default-values';

const themeClass = (name: string) => `.theme-var-ui-${name}`;

describe('extendTokens + createDesignTheme extend/components', () => {
  beforeEach(() => {
    reset();
    resetExtendTokenRegistry();
  });

  it('extendTokens registers mode-aware custom properties on :root', () => {
    const brand = extendTokens('brand', {
      glow: {
        light: '0 0 0 3px oklch(90% 0.1 280)',
        dark: '0 0 16px oklch(70% 0.2 280)',
      },
      halo: 'radial-gradient(circle, red, transparent)',
    });

    expect(brand.glow).toBe('var(--var-ui-brand-glow)');
    expect(brand.halo).toBe('var(--var-ui-brand-halo)');

    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-brand-glow: 0 0 0 3px oklch(90% 0.1 280)');
    expect(css).toContain('--var-ui-brand-halo: radial-gradient(circle, red, transparent)');
    expect(css).toContain(':root[data-mode="dark"]');
    expect(css).toContain('--var-ui-brand-glow: 0 0 16px oklch(70% 0.2 280)');
  });

  it('createDesignTheme extend merges refs onto theme.tokens and scopes values', () => {
    const acme = createDesignTheme({
      name: 'acme-extend',
      from: defaultTokens,
      extend: {
        brand: {
          glow: {
            light: '0 0 4px blue',
            dark: '0 0 8px navy',
          },
        },
      },
    });

    expect(acme.tokens.brand.glow).toBe('var(--var-ui-brand-glow)');
    expect(acme.tokens.color).toBeDefined();

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-extend')}`);
    expect(css).toContain('--var-ui-brand-glow: 0 0 4px blue');
    expect(css).toContain('--var-ui-brand-glow: 0 0 8px navy');
  });

  it('createDesignTheme components emits overrides under the theme class', () => {
    // Touch recipe so base CSS exists
    button({ intent: 'primary', size: 'md' });

    createDesignTheme({
      name: 'acme-components',
      from: defaultTokens,
      components: {
        button: (t) => ({
          base: {
            borderRadius: t.radius.lg,
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

  it('createDesignTheme components accepts plain objects and per-key factories', () => {
    button({ intent: 'primary', size: 'md' });
    badge({});

    createDesignTheme({
      name: 'acme-mixed',
      extend: {
        brand: {
          glow: { light: '0 0 4px blue', dark: '0 0 8px navy' },
        },
      },
      components: {
        button: (t) => ({
          base: { boxShadow: t.brand.glow },
        }),
        badge: {
          base: { borderRadius: '999px' },
        },
      },
    });

    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('acme-mixed')} .var-ui-button`);
    expect(css).toContain('box-shadow: var(--var-ui-brand-glow)');
    expect(css).toContain(`${themeClass('acme-mixed')} .var-ui-badge`);
    expect(css).toContain('border-radius: 999px');
  });

  it('overrideComponent without theme applies globally in overrides layer', () => {
    button({ intent: 'secondary', size: 'sm' });
    overrideComponent(button, {
      base: { borderRadius: '999px' },
    });

    const css = getRegisteredCss();
    expect(css).toMatch(/@layer overrides \{[\s\S]*\.var-ui-button \{/);
    expect(css).toContain('border-radius: 999px');
  });
});
