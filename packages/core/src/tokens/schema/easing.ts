import type { TokenSchema } from 'typestyles';

export const easingTokenSchema = {
  standard: { syntax: '*' },
  emphasized: { syntax: '*' },
} as const satisfies TokenSchema;
