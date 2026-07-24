import { atProperty, type TokenSchema } from 'typestyles';

export const borderWidthTokenSchema = {
  thin: atProperty.length,
  default: atProperty.length,
  thick: atProperty.length,
} as const satisfies TokenSchema;
