import type { TokenSchema } from 'typestyles';
import { customToken } from './custom';

export const shadowTokenSchema = {
  xs: customToken,
  sm: customToken,
  md: customToken,
  lg: customToken,
  xl: customToken,
  elevation: {
    low: customToken,
    med: customToken,
    high: customToken,
  },
} as const satisfies TokenSchema;
