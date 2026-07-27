import { atProperty, type TokenSchema } from 'typestyles';

export const lineHeightTokenSchema = {
  tight: atProperty.number,
  normal: atProperty.number,
  relaxed: atProperty.number,
} as const satisfies TokenSchema;
