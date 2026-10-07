import type { CreateTokenValues, ThemeSurface } from 'typestyles';
import { registerFontFace } from '../fonts/register-font-face';
import { typestyles } from '../runtime';
import { designTokens } from '../tokens';
import { dark } from '../tokens/defaults/color';
import { defaultTokens } from '../tokens/preset';
import type { DesignThemePreset } from '../tokens/types';
import type {
  CustomNamespacesFromTokenMap,
  DesignTheme,
  DesignThemeComponentsFor,
  DesignThemeConfigFields,
} from './types';

/** Default token + dark color base merged when `from` is omitted. */
const builtInPreset: DesignThemePreset = {
  tokens: defaultTokens,
  colorMode: { dark: { color: dark as CreateTokenValues } },
};

type CreateDesignThemeConfig<
  Tok extends Record<string, CreateTokenValues> | undefined,
  Rest extends Omit<DesignThemeConfigFields, 'name' | 'tokens'>,
> = { name: string; tokens?: Tok } & Rest &
  DesignThemeComponentsFor<CustomNamespacesFromTokenMap<NonNullable<Tok>>>;

/**
 * Compile a TypeStyles theme surface (tokens, colorMode, modes, and optional `components` overrides).
 */
export function createDesignTheme<
  const Tok extends Record<string, CreateTokenValues> | undefined = undefined,
  const Rest extends Omit<DesignThemeConfigFields, 'name' | 'tokens'> = {},
>(
  config: CreateDesignThemeConfig<Tok, Rest>,
): DesignTheme<CustomNamespacesFromTokenMap<NonNullable<Tok>>> {
  const { from, tokens: tokenOverrides, colorMode, modes, fonts, name, components } = config;

  const preset = from ?? builtInPreset;
  for (const face of [...(preset.fonts ?? []), ...(fonts ?? [])]) {
    registerFontFace(face);
  }

  type CreateThemeArg = Parameters<typeof typestyles.tokens.createTheme>[0];

  const surface = typestyles.tokens.createTheme({
    name,
    replace: true,
    from: preset,
    tokens: tokenOverrides,
    colorMode,
    modes,
    components,
  } as CreateThemeArg);

  return {
    ...surface,
    tokens: surface.tokens ?? designTokens,
  } as DesignTheme<CustomNamespacesFromTokenMap<NonNullable<Tok>>>;
}

/**
 * Drop a runtime design theme surface (tokens + themed recipe overrides).
 * Avoid theme names where one is a prefix of another (e.g. `dark` and `dark-mode`) — TypeStyles
 * invalidation keys are prefix-based; prefer distinct names until upstream uses boundary-safe matching.
 */
export function disposeDesignTheme(name: string): void {
  typestyles.tokens.disposeTheme(name, { removeLiveCss: true });
}
