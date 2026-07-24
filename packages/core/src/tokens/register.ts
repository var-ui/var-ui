import { tokens } from './declare';
import { defaultTokenValues } from '../themes/default-values';
import { typestyles } from '../runtime';
import { basePaletteTokenValues } from './palette';

/** Registered design token refs — consumed by recipes and theme surfaces. */
export const designTokens = typestyles.tokens.create(
  '',
  {
    palette: basePaletteTokenValues,
    ...defaultTokenValues,
    stroke: {
      default: `${tokens.borderWidth.default.var} solid ${tokens.color.border.default.var}`,
      strong: `${tokens.borderWidth.default.var} solid ${tokens.color.border.strong.var}`,
    },
  },
  { decl: tokens },
) as unknown as typeof tokens;
