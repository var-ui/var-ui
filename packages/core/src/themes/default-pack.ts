import type { DesignTokenPack } from '../types';
import { colorTokens } from '../tokens/register';
import { defaultDarkColorValues, defaultLightColorValues } from './default-values';
import { createNeoBrutalistShadow } from './neo-brutalist-shadows';

/** Default Var UI token pack — pass to `createDesignTheme({ from: defaultTokens })`. */
export const defaultTokens: DesignTokenPack = {
  tokens: {
    color: defaultLightColorValues,
    shadow: createNeoBrutalistShadow(colorTokens.shadow.offset),
  },
  darkColor: defaultDarkColorValues,
};
