import type { ThemeModeDefinition, ThemeSurface } from 'typestyles';
import type { ExtendTokenValues, TokenRefsOf } from './extend-tokens';
import type { DesignThemeTokenValues, DesignTokenPack } from './tokens/types';
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

export type { DesignThemeTokenValues, DesignTokenPack, DesignTokens } from './tokens/types';

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
  tokens?: DesignThemeTokenValues;
  /**
   * Ambient light/dark color slices (Var UI color tree only).
   * Same shape as `createColorTheme`'s return value.
   */
  colorMode?: {
    light?: DesignTokenPack['darkColor'];
    dark?: DesignTokenPack['darkColor'];
  };
  /** Additional TypeStyles modes (surfaces, custom conditions). */
  modes?: ThemeModeDefinition[];
  /**
   * Register fixed-tone surface modes (`data-surface="light"|"dark"`).
   * Defaults to `true`; set `false` to omit or supply custom surface rules in `modes`.
   */
  surfaces?: boolean;
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
