import type { OverrideConfigFor, ThemeModeDefinition, ThemeSurface } from 'typestyles';
import type { ExtendTokenValues, TokenRefsOf } from './theme/extend-tokens';
import type { FontFaceDefinition } from './fonts/types';
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
  ComponentVarValues,
  InferVarDefinitions,
} from 'typestyles';

export { colorModes, conditional } from 'typestyles';

export type { OverrideConfigFor } from './theme/registry';

export type {
  DesignColorValues,
  DesignThemeColorMode,
  DesignThemePreset,
  DesignThemeTokenValues,
  DesignTokens,
} from './tokens/types';

type DesignTokenBag = typeof import('./tokens/declare').tokens;

type ExtendMap = Record<string, ExtendTokenValues>;

/** Custom namespaces declared on `tokens` (excludes built-in design token keys). */
type CustomThemeNamespaces<T> = {
  [K in keyof T as K extends keyof DesignThemeTokenValues
    ? never
    : K]: T[K] extends ExtendTokenValues ? T[K] : never;
} extends infer U
  ? U extends ExtendMap
    ? U
    : Record<string, never>
  : Record<string, never>;

/** Merges `extend` and custom keys from `tokens` for {@link DesignTheme} inference. */
export type InferThemeExtendFromConfig<T> = (T extends { extend: infer E extends ExtendMap }
  ? E
  : Record<string, never>) &
  (T extends { tokens: infer Tok extends Record<string, unknown> }
    ? CustomThemeNamespaces<Tok>
    : Record<string, never>);

/**
 * Built-in design tokens plus refs from custom namespaces on `createDesignTheme({ tokens })`.
 * Hoist custom token maps into a leaf module and use this for per-file component overrides
 * without circular imports (`typeof theme.tokens` would cycle).
 */
export type DesignThemeTokens<E extends ExtendMap = Record<string, never>> = DesignTokenBag &
  TokenRefsOf<E>;

/**
 * Theme config: token overrides, ambient color modes, and optional preset base.
 * Recipe restyles belong on {@link DesignTheme.componentStyles} after creation.
 */
export type DesignThemeConfig = {
  name: string;
  /** Preset to merge onto. Defaults to built-in token values + dark color mode. */
  from?: DesignThemePreset;
  /** Built-in overrides plus custom namespaces (`brand`, …) — all compile to TypeStyles `tokens`. */
  tokens?: DesignThemeTokenValues & ExtendMap;
  /** Ambient light/dark color patches — compiled to `light-dark()` on theme tokens. */
  colorMode?: DesignThemeColorMode;
  /** Additional TypeStyles modes (e.g. dark-only shadow overrides). */
  modes?: ThemeModeDefinition[];
  /** @deprecated Prefer custom namespaces on `tokens`. Still merged at runtime. */
  extend?: ExtendMap;
  /** Self-hosted @font-face definitions registered when the theme is created. */
  fonts?: FontFaceDefinition[];
};

/** Theme surface with token refs and scoped {@link styles.override} helper. */
export type DesignTheme<E extends ExtendMap = Record<string, never>> = ThemeSurface<E> & {
  tokens: DesignThemeTokens<E>;
  componentStyles<C>(
    component: C,
    config: OverrideConfigFor<C> | ((t: DesignThemeTokens<E>) => OverrideConfigFor<C>),
  ): void;
};

export type {
  FontFaceDefinition,
  FontSlotConfig,
  DefineFontsInput,
  DefineFontsResult,
} from './fonts/types';
export { defineFonts } from './fonts/define-fonts';
