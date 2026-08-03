import { atProperty, type TokenSchema } from 'typestyles';

export const linkTokenSchema = {
  default: atProperty.color,
  hover: atProperty.color,
} as const satisfies TokenSchema;
