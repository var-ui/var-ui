import { atProperty, type TokenSchema } from 'typestyles';

export const opacityTokenSchema = {
  disabled: atProperty.number,
  muted: atProperty.number,
} as const satisfies TokenSchema;
