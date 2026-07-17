import { describe, expectTypeOf, it } from 'vite-plus/test';
import type { DesignThemeConfig, OverrideConfigFor, ThemeComponentsConfig } from './types';
import { button } from './components/button';
import { card } from './components/card';
import { badge } from './components/badge';

describe('OverrideConfigFor / ThemeComponentsConfig typing', () => {
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

    expectTypeOf(ok.base).toMatchTypeOf<{ borderRadius?: string | number } | undefined>();
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
    const components: ThemeComponentsConfig = {
      button: (t) => ({
        base: { boxShadow: t.shadow.md, borderRadius: t.radius.lg },
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
    void components;

    const config = {
      name: 'typed',
      components,
    } satisfies DesignThemeConfig;
    void config;
  });
});
