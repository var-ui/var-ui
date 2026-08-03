import type { TokenSchema } from 'typestyles';
import { customToken } from './custom';

export const strokeTokenSchema = {
  default: customToken,
  strong: customToken,
} as const satisfies TokenSchema;
