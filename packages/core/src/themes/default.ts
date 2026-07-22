import { createDesignTheme, SURFACE_ATTRIBUTE } from '../create-theme';
import { tokens } from '../runtime';
import { defaultTokens } from './default-values';

export { defaultLightColorValues, defaultDarkColorValues, defaultTokens } from './default-values';

export const defaultTheme = createDesignTheme({
  name: 'default',
  from: defaultTokens,
  modes: [
    {
      id: 'surface-dark',
      overrides: { color: defaultTokens.darkColor },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    },
    {
      id: 'surface-light',
      overrides: { color: defaultTokens.tokens.color },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'light', { scope: 'descendant' }),
    },
  ],
});
