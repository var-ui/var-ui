import type { TokenSchema } from 'typestyles';

export const strokeTokenSchema = {
  default: { syntax: '*' },
  strong: { syntax: '*' },
} as const satisfies TokenSchema;
