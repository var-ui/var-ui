import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { createDesignTheme, SURFACE_ATTRIBUTE } from './create-theme';
import { tokens } from './runtime';
import { defaultTokens } from './themes/default-values';
import { designTokens } from './tokens';

/** Runtime uses scopeId `var-ui` — theme classes are `theme-var-ui-<name>`. */
const themeClass = (name: string) => `.theme-var-ui-${name}`;

describe('createDesignTheme', () => {
  beforeEach(() => {
    reset();
  });

  it('emits dark color overrides without mode-invariant namespaces', () => {
    createDesignTheme({
      name: 'color-only-dark',
      from: defaultTokens,
      tokens: { fontSize: { md: '20px' } },
      colorMode: {
        dark: { accent: { default: '#ff0000', hover: '#cc0000' } },
      },
    });
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-color-accent-default: #ff0000');
    expect(css).toContain('--var-ui-fontSize-md: 20px');
  });

  it('accepts token refs in tokens.color', () => {
    createDesignTheme({
      name: 'ref-accent',
      colorMode: {
        light: {
          accent: {
            default: designTokens.palette['sky-7'],
            hover: designTokens.palette['sky-8'],
          },
        },
      },
    });
    const css = getRegisteredCss();
    expect(css).toMatch(/--var-ui-color-accent-default:\s*var\(--var-ui-palette-sky-7\)/);
  });

  it('appends consumer modes for surfaces', () => {
    const { darkColor } = defaultTokens;
    createDesignTheme({
      name: 'with-surface',
      from: defaultTokens,
      modes: [
        {
          id: 'surface-dark',
          overrides: { color: darkColor },
          when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
        },
      ],
    });
    const css = getRegisteredCss();
    expect(css).toContain(`${themeClass('with-surface')} [${SURFACE_ATTRIBUTE}="dark"]`);
    expect(css).toContain(`${SURFACE_ATTRIBUTE}="dark"`);
  });

  it('omits surface rules when modes is omitted', () => {
    createDesignTheme({
      name: 'ambient-only',
      from: defaultTokens,
    });

    const css = getRegisteredCss();
    expect(css).not.toContain(`[${SURFACE_ATTRIBUTE}="dark"]`);
    expect(css).not.toContain(`[${SURFACE_ATTRIBUTE}="light"]`);
    expect(css).toContain(`${themeClass('ambient-only')}[data-mode="dark"]`);
  });

  it('lets `data-mode="system"` fall through to the plain prefers-color-scheme rule', () => {
    createDesignTheme({
      name: 'system-fixture',
      from: defaultTokens,
    });

    const css = getRegisteredCss();
    expect(css).toMatch(
      /@media \(prefers-color-scheme:\s*dark\)\s*{\s*\.theme-var-ui-system-fixture\s*{/,
    );
    expect(css).toContain(`${themeClass('system-fixture')}[data-mode="dark"]`);
    expect(css).not.toContain(`${themeClass('system-fixture')}[data-mode="system"]`);
  });

  it('deep-merges partial colorMode onto the default pack', () => {
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
    expect(css).toContain('--var-ui-color-accent-default: oklch(55% 0.2 290)');
    expect(css).toMatch(/--var-ui-color-background-app:\s*#F5F1E9/);
    expect(css).toMatch(/--var-ui-color-background-app:\s*oklch\(23%/);
  });
});
