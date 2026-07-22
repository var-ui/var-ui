import type { ThemeModeDefinition, ThemeSurface } from 'typestyles';
import type { ExtendTokenValues, TokenRefsOf } from './extend-tokens';
import type { designTokens } from './tokens';
import type {
  DesignColorValues,
  DesignSyntaxValues,
  DesignTokenLeaf,
  WithTokenLeaves,
} from './tokens/semantic';
import type {
  DesignBorderWidthValues,
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
 * Deep partial that widens primitive leaves to `DesignTokenLeaf` so string
 * literals from `typeof` values and token refs both remain assignable.
 */
export type DeepPartialKeepingLeaves<T> = T extends string | number
  ? DesignTokenLeaf
  : T extends readonly (infer U)[]
    ? readonly DeepPartialKeepingLeaves<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartialKeepingLeaves<T[K]> }
      : T;

export type DesignThemeTokenValues = {
  color: DesignColorValues;
  /** Optional namespaces may be partial (e.g. style themes override only `duration.fast`). */
  space?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignSpaceValues>>;
  radius?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignRadiusValues>>;
  fontFamily?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignFontFamilyValues>>;
  fontSize?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignFontSizeValues>>;
  fontWeight?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignFontWeightValues>>;
  lineHeight?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignLineHeightValues>>;
  shadow?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignShadowValues>>;
  duration?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignDurationValues>>;
  easing?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignEasingValues>>;
  transition?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignTransitionValues>>;
  borderWidth?: DeepPartialKeepingLeaves<WithTokenLeaves<DesignBorderWidthValues>>;
};

export type DesignTokenPack = {
  tokens: DesignThemeTokenValues;
  darkColor: DesignColorValues;
};

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
 * Thin theme config: pack + mode-invariant token patches + colorMode + extra modes.
 */
export type DesignThemeConfig<E extends ExtendMap = Record<string, never>> = {
  name: string;
  /** Token pack to merge onto. Defaults to `defaultTokens`. */
  from?: DesignTokenPack;
  /** Mode-invariant patches + optional light `color` overrides. */
  tokens?: DeepPartialKeepingLeaves<DesignThemeTokenValues>;
  /**
   * Ambient light/dark color slices (Var UI color tree only).
   * Same shape as `createColorTheme`'s return value.
   */
  colorMode?: {
    light?: DeepPartialKeepingLeaves<DesignColorValues>;
    dark?: DeepPartialKeepingLeaves<DesignColorValues>;
  };
  /** Additional TypeStyles modes (surfaces, custom conditions). */
  modes?: ThemeModeDefinition[];
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

export type { DesignColorValues, DesignSyntaxValues, DesignTokenLeaf, WithTokenLeaves };
