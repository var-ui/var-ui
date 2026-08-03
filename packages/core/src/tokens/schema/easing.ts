import type { TokenSchema } from 'typestyles';
import { customToken } from './custom';

export const easingTokenSchema = {
  standard: customToken,
  emphasized: customToken,
} as const satisfies TokenSchema;
