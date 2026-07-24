import type { DesignTokenPack } from '../types';
import { designTokens } from '../tokens';
import { defaultDarkColorValues, defaultLightColorValues } from './default-values';
import { createNeoBrutalistShadow } from './neo-brutalist-shadows';

/** Default Var UI token pack — pass to `createDesignTheme({ from: defaultTokens })`. */
export const defaultTokens: DesignTokenPack = {
  tokens: {
    color: defaultLightColorValues,
    shadow: createNeoBrutalistShadow(designTokens.color.shadow.offset.var),
  },
  darkColor: defaultDarkColorValues,
};
