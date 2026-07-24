import type { TokenSchema } from 'typestyles';

export const fontFamilyTokenSchema = {
  display: { syntax: '*' },
  sans: { syntax: '*' },
  mono: { syntax: '*' },
} as const satisfies TokenSchema;
