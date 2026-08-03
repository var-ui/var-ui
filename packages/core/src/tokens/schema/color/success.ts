import { atProperty, type TokenSchema } from 'typestyles';

export const successTokenSchema = {
  default: atProperty.color,
  solid: atProperty.color,
  subtle: atProperty.color,
  border: atProperty.color,
} as const satisfies TokenSchema;
