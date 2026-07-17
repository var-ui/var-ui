import type { ThemeOverrides, ThemeSurface } from 'typestyles';
import type { ExtendTokenValues, TokenRefsOf } from './extend-tokens';
import type { designTokens } from './tokens';
import type { DesignColorValues, DesignSyntaxValues } from './tokens/semantic';
import type {
  DesignDurationValues,
  DesignEasingValues,
  DesignFontFamilyValues,
  DesignFontSizeValues,
  DesignFontWeightValues,
  DesignLineHeightValues,
  DesignRadiusValues,
  DesignShadowValues,
  DesignSpaceValues,
  DesignTransitionValues,
} from './tokens/primitive';
import type { ThemeableComponentName } from './themeable-components';
import type { ThemeComponentOverrideFor } from './theme-override-types';

export type {
  OverrideConfigFor,
  ThemeComponentOverride,
  ThemeComponentOverrideFor,
  ThemeFlatOverrideConfig,
  ThemeMultiSlotOverrideConfig,
  ThemeOverrideConfig,
  ThemeOverrideStyle,
  ThemeSlotOverrideConfig,
} from './theme-override-types';

export type DesignSemanticValues = {
  color: DesignColorValues;
  syntax: DesignSyntaxValues;
};

export type DesignPrimitiveOverrides = {
  space?: Partial<DesignSpaceValues>;
  radius?: Partial<DesignRadiusValues>;
  fontFamily?: Partial<DesignFontFamilyValues>;
  fontSize?: Partial<DesignFontSizeValues>;
  fontWeight?: Partial<DesignFontWeightValues>;
  lineHeight?: Partial<DesignLineHeightValues>;
  shadow?: Partial<DesignShadowValues>;
  duration?: Partial<DesignDurationValues>;
  easing?: Partial<DesignEasingValues>;
  transition?: Partial<DesignTransitionValues>;
};

type DesignTokenBag = typeof designTokens;

type ExtendMap = Record<string, ExtendTokenValues>;

/**
 * Built-in design tokens plus refs from an `extend` map.
 * Hoist `extend` into a leaf module and use this for per-file component overrides
 * without circular imports (`typeof theme.tokens` would cycle).
 */
export type DesignThemeTokens<E extends ExtendMap = Record<string, never>> = DesignTokenBag &
  TokenRefsOf<E>;

/**
 * Per-recipe entry: static override object, or a factory that receives theme tokens
 * (built-ins + `extend` refs). Prefer factories in separate files for split themes.
 */
export type ThemeComponentEntry<
  TTokens = DesignThemeTokens,
  K extends ThemeableComponentName = ThemeableComponentName,
> = ThemeComponentOverrideFor<K> | ((t: TTokens) => ThemeComponentOverrideFor<K>);

/**
 * Per-recipe override map. Keys are themeable recipes; values are typed to that
 * recipe's override shape (`base` / `variants` / slots) with CSS property IntelliSense.
 */
export type ThemeComponentsConfig<TTokens = DesignThemeTokens> = {
  [K in ThemeableComponentName]?: ThemeComponentEntry<TTokens, K>;
};

/**
 * Palette config aligned with `tokens.createTheme`: `base` is the light surface;
 * `dark` is the dark-mode override layer (same shape as `ThemeOverrides`).
 */
export type DesignThemeConfig<E extends ExtendMap = Record<string, never>> = {
  name: string;
  /**
   * Partial light-face overrides. Deep-merged onto `defaultLightValues`
   * (omit or `{}` to keep the built-in light palette).
   */
  light?: ThemeOverrides;
  /**
   * Partial dark-face overrides. Deep-merged onto `defaultDarkValues`
   * (omit or `{}` to keep the built-in dark palette).
   */
  dark?: ThemeOverrides;
  /**
   * Fixed-tone overrides for elements marked with `data-surface`, regardless of ambient mode.
   * Each face is deep-merged onto the resolved light/dark palette for that theme.
   */
  surfaces?: {
    light?: ThemeOverrides;
    dark?: ThemeOverrides;
  };
  /** Custom token namespaces; leaves are a string or `{ light, dark }`. */
  extend?: E;
  /**
   * Typed component restyles. Each entry is a plain override or `(t) => override`.
   * Compiles to `styles.override` under this theme's class in the `overrides` layer.
   */
  components?: ThemeComponentsConfig<DesignThemeTokens<E>>;
};

/** Theme surface plus merged token refs when `extend` is used. */
export type DesignTheme<E extends ExtendMap = Record<string, never>> = ThemeSurface & {
  tokens: DesignThemeTokens<E>;
};

export type { DesignColorValues, DesignSyntaxValues };
