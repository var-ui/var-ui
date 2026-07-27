import type { ThemeModeDefinition, ThemeSurface } from 'typestyles';
import type { ExtendTokenValues, TokenRefsOf } from './extend-tokens';
import type { FontFaceDefinition } from './fonts/types';
import type { ThemeableComponentName, ThemeComponentOverrideFor } from './themeable-components';
import type {
  DesignThemeColorMode,
  DesignThemePreset,
  DesignThemeTokenValues,
} from './tokens/types';

export type {
  ConditionalOverride,
  FlatOverrideConfig,
  MultiSlotOverrideConfig,
  OverrideConfig,
  OverrideOptions,
  SlotOverrideConfig,
  StylableOverride,
  ThemeCondition,
  VariantOptionStyle,
} from 'typestyles';

export { colorModes, conditional } from 'typestyles';

export type {
  OverrideConfigFor,
  ThemeableComponentName,
  ThemeComponentOverride,
  ThemeComponentOverrideFor,
} from './themeable-components';

export type {
  DesignColorValues,
  DesignThemeColorMode,
  DesignThemePreset,
  DesignThemeTokenValues,
  DesignTokens,
} from './tokens/types';

type DesignTokenBag = typeof import('./tokens/declare').tokens;

type ExtendMap = Record<string, ExtendTokenValues>;

/**
 * Built-in design tokens plus refs from an `extend` map.
 * Hoist `extend` into a leaf module and use this for per-file component overrides
 * without circular imports (`typeof theme.tokens` would cycle).
 */
export type DesignThemeTokens<E extends ExtendMap = Record<string, never>> = DesignTokenBag &
  TokenRefsOf<E>;

/**
 * Runtime-valid override shape when recipe inference is too strict for `conditions`
 * or `{ light, dark }` property values (see `when` / `colorModes`).
 */
export type ThemeComponentOverrideInput = {
  base?: Record<string, unknown>;
  variants?: Record<string, Record<string, Record<string, unknown>>>;
  compoundVariants?: ReadonlyArray<{
    variants: Record<string, string>;
    style: Record<string, unknown>;
  }>;
};

/**
 * Per-recipe entry: static override object, or a factory that receives theme tokens
 * (built-ins + `extend` refs). Prefer factories in separate files for split themes.
 */
export type ThemeComponentEntry<
  TTokens = DesignThemeTokens,
  K extends ThemeableComponentName = ThemeableComponentName,
> =
  | ThemeComponentOverrideFor<K>
  | ThemeComponentOverrideInput
  | ((t: TTokens) => ThemeComponentOverrideFor<K> | ThemeComponentOverrideInput);

/**
 * Per-recipe override map. Keys are themeable recipes; values are typed to that
 * recipe's override shape (`base` / `variants` / slots) with CSS property IntelliSense.
 */
export type ThemeComponentsConfig<TTokens = DesignThemeTokens> = {
  [K in ThemeableComponentName]?: ThemeComponentEntry<TTokens, K>;
};

/**
 * Theme config: token overrides, ambient color modes, and optional preset base.
 */
export type DesignThemeConfig<E extends ExtendMap = Record<string, never>> = {
  name: string;
  /** Preset to merge onto. Defaults to built-in token values + dark color mode. */
  from?: DesignThemePreset;
  /** Mode-invariant token overrides; light `color` lives here by default. */
  tokens?: DesignThemeTokenValues;
  /** Ambient light/dark color patches — compiled to `light-dark()` on theme tokens. */
  colorMode?: DesignThemeColorMode;
  /** Additional TypeStyles modes (e.g. dark-only shadow overrides). */
  modes?: ThemeModeDefinition[];
  /**
   * @deprecated Surfaces use global `color-scheme` on `data-surface` since V9.
   * Kept for API compatibility; has no effect.
   */
  surfaces?: boolean;
  /** Custom token namespaces; leaves are a string or `{ light, dark }`. */
  extend?: E;
  /**
   * Typed component restyles. Each entry is a plain override or `(t) => override`.
   * Compiles to `styles.override` under this theme's class in the `overrides` layer.
   */
  components?: ThemeComponentsConfig<DesignThemeTokens<E>>;
  /** Self-hosted @font-face definitions registered when the theme is created. */
  fonts?: FontFaceDefinition[];
};

/** Theme surface plus merged token refs when `extend` is used. */
export type DesignTheme<E extends ExtendMap = Record<string, never>> = ThemeSurface & {
  tokens: DesignThemeTokens<E>;
};

export type {
  FontFaceDefinition,
  FontSlotConfig,
  DefineFontsInput,
  DefineFontsResult,
} from './fonts/types';
export { defineFonts } from './fonts/define-fonts';
