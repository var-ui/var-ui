import { mergeThemeOverrides, type ThemeOverrides } from 'typestyles';
import { invalidateKeys } from 'typestyles/hmr';
import { registerExtendMap, type ExtendTokenValues } from './extend-tokens';
import { registerFontFace } from './fonts/register-font-face';
import { typestyles } from './runtime';
import { dark } from './tokens/defaults/color';
import { tokenValues } from './tokens/preset';
import { t } from './tokens/declare';
import { splitModeAwareColorValues } from './split-mode-aware-colors';
import type {
  DesignColorValues,
  DesignTheme,
  DesignThemeConfig,
  DesignThemePreset,
  DesignThemeTokenValues,
  DesignThemeTokens,
} from './types';

export { mergeThemeOverrides, mergeThemeOverrides as deepMergeThemeOverrides } from 'typestyles';

/** @internal Shared with theme-component-overrides for generic theme config typing. */
export type ExtendMap = Record<string, ExtendTokenValues>;

/** Default token + dark color base merged when `from` is omitted. */
const builtInPreset: DesignThemePreset = {
  tokens: tokenValues,
  colorMode: { dark },
};

type ColorPatch = DesignColorValues;

/** Combine the registered token tree with optional `extend` namespace refs. */
function mergeDesignTokenRefs(extendRefs?: Record<string, unknown>): typeof t {
  if (!extendRefs || Object.keys(extendRefs).length === 0) return t;
  return new Proxy(t, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && prop in extendRefs) {
        return extendRefs[prop];
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

function deepMergeColor(base: ColorPatch | undefined, patch?: ColorPatch): ColorPatch {
  return mergeThemeOverrides(
    { color: base ?? {} } as ThemeOverrides,
    patch ? ({ color: patch } as ThemeOverrides) : undefined,
  ).color as ColorPatch;
}

function omitColor(values: DesignThemeTokenValues): Omit<DesignThemeTokenValues, 'color'> {
  const { color: _color, ...rest } = values;
  return rest;
}

/** Match TypeStyles `sanitizeClassSegment` so sheet keys line up with `createTheme`. */
function sanitizeThemeSegment(label: string): string {
  return (
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'style'
  );
}

function designThemeSheetSegment(name: string): string {
  const scopeId = typestyles.tokens.scopeId;
  const sanitizedName = sanitizeThemeSegment(name);
  return scopeId ? `${sanitizeThemeSegment(scopeId)}-${sanitizedName}` : sanitizedName;
}

/** True when `selector` appears as its own selector, not a longer class prefix. */
function cssTextContainsExactSelector(cssText: string, selector: string): boolean {
  let from = 0;
  while (from < cssText.length) {
    const idx = cssText.indexOf(selector, from);
    if (idx === -1) return false;
    const next = cssText[idx + selector.length];
    if (next === '{' || next === ' ' || next === ',' || next === ':') return true;
    from = idx + selector.length;
  }
  return false;
}

/**
 * Drop live CSSOM rules for one theme class. Uses exact selector matching so
 * disposing `dark` does not remove `.theme-var-ui-dark-mode` (unlike prefix
 * matching on `selectorText.startsWith`).
 */
function removeLiveCssomRulesForExactSelector(selector: string): void {
  if (typeof document === 'undefined') return;
  const sheet = (document.getElementById('typestyles') as HTMLStyleElement | null)?.sheet;
  if (!sheet) return;

  const purge = (list: CSSRuleList, owner: CSSStyleSheet | CSSGroupingRule): void => {
    for (let i = list.length - 1; i >= 0; i -= 1) {
      const rule = list[i]!;
      if ('selectorText' in rule) {
        const styleRule = rule as CSSStyleRule;
        if (styleRule.selectorText === selector) {
          owner.deleteRule(i);
          continue;
        }
      }
      if ('cssRules' in rule) {
        const grouping = rule as CSSGroupingRule;
        if (grouping.cssRules.length > 0) {
          purge(grouping.cssRules, grouping);
        }
        if (grouping.cssRules.length === 0) {
          owner.deleteRule(i);
          continue;
        }
      }
      if (!('selectorText' in rule) && cssTextContainsExactSelector(rule.cssText, selector)) {
        owner.deleteRule(i);
      }
    }
  };

  purge(sheet.cssRules, sheet);
}

/**
 * Drop TypeStyles sheet rules for a design theme so the same `name` can replace
 * in place. TypeStyles has no `removeTheme`; `invalidateKeys` is the public
 * unregister API (0.23.1+ also drops layered rules from live CSS).
 */
export function unregisterDesignTheme(name: string): void {
  const segment = designThemeSheetSegment(name);
  const classSelector = `.theme-${segment}`;
  invalidateKeys(
    [],
    [
      `layer:tokens:theme:${segment}:`,
      `theme:${segment}:`,
      `layer:overrides:override:${classSelector}:`,
      `override:${classSelector}:`,
    ],
  );
  removeLiveCssomRulesForExactSelector(classSelector);
}

/**
 * Merge token overrides + ambient colorMode and compile a TypeStyles theme surface.
 * Does not apply per-recipe `components` overrides — use {@link createDesignTheme} for that.
 */
export function createDesignThemeBase<const E extends ExtendMap = Record<string, never>>(
  config: Omit<DesignThemeConfig<E>, 'components'>,
): DesignTheme<E> {
  unregisterDesignTheme(config.name);
  const { from, tokens: tokenOverrides, colorMode, modes, extend, fonts } = config;

  const extendResult = extend ? registerExtendMap(extend) : undefined;
  const mergedTokensRefs = mergeDesignTokenRefs(extendResult?.refs) as DesignThemeTokens<E>;

  const preset = from ?? builtInPreset;
  const mergedFonts = [...(preset.fonts ?? []), ...(fonts ?? [])];
  for (const face of mergedFonts) {
    registerFontFace(face);
  }
  const mergedTokens = mergeThemeOverrides(
    (preset.tokens ?? {}) as ThemeOverrides,
    (tokenOverrides ?? {}) as ThemeOverrides,
  ) as DesignThemeTokenValues;

  const { base: baseColor, darkPatch: inlineDarkColorPatch } = splitModeAwareColorValues(
    mergedTokens.color,
  );

  const base = {
    ...omitColor(mergedTokens),
    color: baseColor,
    ...extendResult?.overrides,
  } as ThemeOverrides;

  const theme = typestyles.tokens.createTheme(config.name, {
    base,
    colorMode: {
      light: {
        color: deepMergeColor(preset.colorMode?.light, colorMode?.light),
      },
      dark: {
        color: deepMergeColor(
          deepMergeColor(preset.colorMode?.dark, inlineDarkColorPatch),
          colorMode?.dark,
        ),
      },
    },
    modes: modes ?? [],
  });

  return Object.assign(theme, { tokens: mergedTokensRefs });
}
