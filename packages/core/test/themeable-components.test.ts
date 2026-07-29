import { describe, it, expect, expectTypeOf } from 'vite-plus/test';
import type { DesignThemeConfig, ThemeComponentsConfig } from '../src/types';
import type { OverrideConfigFor } from '../src/themeable-components';
import * as components from '../src/components';
import { themeableComponents } from '../src/themeable-components';
import { button } from '../src/components/button';
import { card } from '../src/components/card';
import { badge } from '../src/components/badge';

describe('themeableComponents', () => {
  it('includes every exported recipe function from components/', () => {
    const recipeExports = Object.entries(components).filter(
      ([name, value]) =>
        typeof value === 'function' &&
        // Skip non-recipe helpers re-exported from components
        !['layoutUtility', 'text', 'namedContainerQuery', 'codeHljsScope'].includes(name) &&
        !name.endsWith('Chrome') &&
        !name.startsWith('create'),
    );

    const missing: string[] = [];
    for (const [name, value] of recipeExports) {
      const registered = Object.values(themeableComponents).includes(
        value as (typeof themeableComponents)[keyof typeof themeableComponents],
      );
      if (!registered) missing.push(name);
    }

    expect(missing, `Add missing recipes to themeableComponents: ${missing.join(', ')}`).toEqual(
      [],
    );
  });

  it('infers dimensioned button override shape with CSS + variant keys', () => {
    type ButtonOverride = OverrideConfigFor<typeof button>;

    // Assignability checks (prefer over toMatchTypeOf — OverrideConfig includes
    // `vars?: never` which breaks vitest's exact MatchType helper).
    const ok: ButtonOverride = {
      base: { borderRadius: '999px' },
      variants: {
        intent: {
          primary: { textTransform: 'uppercase' },
        },
      },
    };
    void ok;

    const badDimension: ButtonOverride = {
      variants: {
        // @ts-expect-error unknown variant dimension
        notADimension: { primary: { color: 'red' } },
      },
    };
    void badDimension;

    // VariantOptionStyle allows custom keys (custom props / nested blocks) while
    // still mapping known CSS properties for IntelliSense.
    const customProp: ButtonOverride = {
      base: {
        borderRadius: '999px',
        '--brand-ring': '0 0 0 3px blue',
      },
    };
    void customProp;

    expectTypeOf(ok).toHaveProperty('base');
  });

  it('infers slotted card override with slot keys', () => {
    type CardOverride = OverrideConfigFor<typeof card>;
    const ok: CardOverride = {
      base: {
        root: { borderRadius: '16px' },
        title: { fontWeight: 700 },
      },
    };
    void ok;
  });

  it('accepts badge tone overrides on the flat recipe', () => {
    type BadgeOverride = OverrideConfigFor<typeof badge>;
    const ok: BadgeOverride = {
      base: { borderRadius: '999px' },
    };
    void ok;
  });

  it('types createDesignTheme components map per recipe', () => {
    const componentOverrides: ThemeComponentsConfig = {
      button: (t) => ({
        base: { boxShadow: t.shadow.md.var, borderRadius: t.radius.lg.var },
        variants: {
          intent: {
            primary: { textTransform: 'uppercase' },
          },
        },
      }),
      card: {
        base: {
          root: { borderRadius: '16px' },
        },
      },
      badge: { base: { letterSpacing: '0.06em' } },
    };
    void componentOverrides;

    const config = {
      name: 'typed',
      components: componentOverrides,
    } satisfies DesignThemeConfig;
    void config;
  });
});
