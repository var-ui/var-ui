import { atProperty, type TokenSchema } from 'typestyles';

export const textTokenSchema = {
  primary: atProperty.color,
  secondary: atProperty.color,
  onAccent: atProperty.color,
  onDanger: atProperty.color,
  onSuccess: atProperty.color,
  onWarning: atProperty.color,
  onInfo: atProperty.color,
  disabled: atProperty.color,
  placeholder: atProperty.color,
  info: atProperty.color,
} as const satisfies TokenSchema;
