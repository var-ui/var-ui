import type { TokenSchema } from 'typestyles';
import { customToken } from './custom';

export const fontFamilyTokenSchema = {
  body: customToken,
  display: customToken,
  mono: customToken,
} as const satisfies TokenSchema;
