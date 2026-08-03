import { atProperty, type TokenSchema } from 'typestyles';

export const accentTokenSchema = {
  default: atProperty.color,
  hover: atProperty.color,
  subtle: atProperty.color,
} as const satisfies TokenSchema;
