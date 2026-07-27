import { atProperty, type TokenSchema } from 'typestyles';

export const radiusTokenSchema = {
  none: atProperty.lengthPercentage,
  sm: atProperty.lengthPercentage,
  md: atProperty.lengthPercentage,
  lg: atProperty.lengthPercentage,
  xl: atProperty.lengthPercentage,
  full: atProperty.lengthPercentage,
} as const satisfies TokenSchema;
