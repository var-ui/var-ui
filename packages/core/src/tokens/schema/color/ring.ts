import { atProperty, type TokenSchema } from 'typestyles';

export const ringTokenSchema = {
  default: atProperty.color,
} as const satisfies TokenSchema;
