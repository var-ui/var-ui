import { atProperty, type TokenSchema } from 'typestyles';

export const backgroundTokenSchema = {
  app: atProperty.color,
  surface: atProperty.color,
  subtle: atProperty.color,
  elevated: atProperty.color,
  popover: atProperty.color,
  muted: atProperty.color,
  secondary: atProperty.color,
  tertiary: atProperty.color,
  info: atProperty.color,
} as const satisfies TokenSchema;
