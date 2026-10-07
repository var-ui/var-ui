import type { CreateTokenValues, ThemeSurface, TokenRefTree } from 'typestyles';
import type { FontFaceDefinition } from '../fonts/types';
import type {
  DesignThemePreset,
  DesignThemeTokenValues,
  ThemeColorModePatches,
  ThemeModeDefinition,
} from '../tokens/types';

type DesignTokenBag = typeof import('../tokens/declare').tokens;

/** Fields accepted by {@link createDesignTheme} (excluding recipe overrides). */
export type DesignThemeConfigFields = {
  name: string;
  from?: DesignThemePreset;
  /** Built-in namespace patches plus custom namespaces (e.g. `brand`). */
  tokens?: Record<string, CreateTokenValues>;
  colorMode?: ThemeColorModePatches;
  modes?: ThemeModeDefinition[];
  fonts?: FontFaceDefinition[];
};

export type CustomNamespacesFromTokenMap<Tokens> =
  Tokens extends Record<string, CreateTokenValues>
    ? Omit<Tokens, keyof DesignThemeTokenValues>
    : Record<string, never>;

/** Custom `tokens` namespaces from a theme config (excludes built-in design namespaces). */
export type InferCustomThemeTokens<C extends DesignThemeConfigFields> = C extends {
  tokens: infer Tok extends Record<string, CreateTokenValues>;
}
  ? CustomNamespacesFromTokenMap<Tok>
  : Record<string, never>;

/**
 * Declared design token refs plus custom namespaces from `createDesignTheme({ tokens })`.
 * Hoist custom token maps into a leaf module for override factories (avoids `typeof theme.tokens` cycles).
 */
export type DesignThemeTokens<E extends Record<string, CreateTokenValues> = Record<string, never>> =
  DesignTokenBag & {
    readonly [K in keyof E & string]: TokenRefTree<E[K]>;
  };

/** Context passed to theme `components` factories — full design token refs + custom namespaces. */
export type DesignThemeComponentOverrideContext<
  E extends Record<string, CreateTokenValues> = Record<string, never>,
> = {
  readonly tokens: DesignThemeTokens<E>;
  readonly theme: DesignTheme<E>;
};

type DesignThemeComponentOverrideFn<E extends Record<string, CreateTokenValues>> = (
  ctx: DesignThemeComponentOverrideContext<E>,
) => Record<string, unknown>;

/** Typed `components` map for {@link createDesignTheme} (matches runtime `surface.tokens`). */
export type DesignThemeComponentsFor<E extends Record<string, CreateTokenValues>> = {
  components?: Record<string, Record<string, unknown> | DesignThemeComponentOverrideFn<E>>;
};

/** Var UI theme input — token layers, fonts, and TypeStyles `components` overrides. */
export type DesignThemeConfig = DesignThemeConfigFields &
  DesignThemeComponentsFor<Record<string, never>>;

/** Theme surface returned by {@link createDesignTheme}. Recipe overrides use config `components`. */
export type DesignTheme<E extends Record<string, CreateTokenValues> = Record<string, never>> =
  ThemeSurface<E> & {
    tokens: DesignThemeTokens<E>;
  };

/** @deprecated Use {@link InferCustomThemeTokens} */
export type InferThemeExtendFromConfig<C extends DesignThemeConfigFields> =
  InferCustomThemeTokens<C>;
