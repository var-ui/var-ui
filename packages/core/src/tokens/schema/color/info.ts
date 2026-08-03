import { atProperty, type TokenSchema } from 'typestyles';

export const infoTokenSchema = {
  default: atProperty.color,
  onSolid: atProperty.color,
  subtle: atProperty.color,
  border: atProperty.color,
} as const satisfies TokenSchema;
