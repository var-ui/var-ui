import { atProperty, type TokenSchema } from 'typestyles';

export const borderTokenSchema = {
  default: atProperty.color,
  strong: atProperty.color,
  focus: atProperty.color,
  subtle: atProperty.color,
} as const satisfies TokenSchema;
