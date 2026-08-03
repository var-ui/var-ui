import { atProperty, type TokenSchema } from 'typestyles';

export const trackTokenSchema = {
  default: atProperty.color,
} as const satisfies TokenSchema;
