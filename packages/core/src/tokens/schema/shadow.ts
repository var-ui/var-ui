import type { TokenSchema } from 'typestyles';

export const shadowTokenSchema = {
  xs: { syntax: '*' },
  sm: { syntax: '*' },
  md: { syntax: '*' },
  lg: { syntax: '*' },
  xl: { syntax: '*' },
  elevation: {
    low: { syntax: '*' },
    med: { syntax: '*' },
    high: { syntax: '*' },
  },
} as const satisfies TokenSchema;
