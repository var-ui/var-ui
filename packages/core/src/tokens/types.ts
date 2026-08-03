import type { InferValuesFromSchema } from 'typestyles';
import type { FontFaceDefinition } from '../fonts/types';
import type { tokenSchema } from './schema';

type DeepPartial<T> = T extends string | number
  ? string | number
  : T extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/** Require every key from a schema-derived token value tree (for default registration). */
type RequiredTokenValues<S> =
  S extends Record<string, unknown> ? { [K in keyof S]-?: RequiredTokenValues<S[K]> } : S;

type ThemeOverridableNamespace = Exclude<keyof DesignTokens, 'stroke'>;

/**
 * Canonical Var UI token tree — derived from `tokenSchema` so new schema keys
 * surface as type errors in `defaults/` until values are registered.
 */
export type DesignTokens = RequiredTokenValues<InferValuesFromSchema<typeof tokenSchema>>;

/** Semantic color tokens — palette ramps are registered separately. */
export type SemanticColorTokens = Omit<DesignTokens['color'], 'palette'>;

/** Token namespaces a theme surface can override. */
export type DesignThemeTokenValues = {
  [K in ThemeOverridableNamespace]?: DeepPartial<DesignTokens[K]>;
};

/** Ambient light/dark color patches — compiled into TypeStyles color modes. */
export type DesignColorValues = DeepPartial<DesignTokens['color']>;

export type DesignThemeColorMode = {
  light?: DesignColorValues;
  dark?: DesignColorValues;
};

/** Reusable `tokens` + `colorMode` defaults for `createDesignTheme({ from })`. */
export type DesignThemePreset = {
  tokens?: DesignThemeTokenValues;
  colorMode?: DesignThemeColorMode;
  fonts?: FontFaceDefinition[];
};
