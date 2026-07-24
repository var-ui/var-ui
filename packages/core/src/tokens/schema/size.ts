import { atProperty, type TokenSchema } from 'typestyles';

export const sizeTokenSchema = {
  control: {
    sm: atProperty.length,
    md: atProperty.length,
    lg: atProperty.length,
  },
  icon: {
    sm: atProperty.length,
    md: atProperty.length,
    lg: atProperty.length,
  },
} as const satisfies TokenSchema;
