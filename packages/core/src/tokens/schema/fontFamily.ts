import type { TokenSchema } from 'typestyles';
import { customToken } from './custom';

export const fontFamilyTokenSchema = {
  display: customToken,
  sans: customToken,
  mono: customToken,
} as const satisfies TokenSchema;
