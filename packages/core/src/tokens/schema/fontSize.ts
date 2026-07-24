import { atProperty, type TokenSchema } from 'typestyles';

export const fontSizeTokenSchema = {
  xs: atProperty.lengthPercentage,
  sm: atProperty.lengthPercentage,
  md: atProperty.lengthPercentage,
  lg: atProperty.lengthPercentage,
  xl: atProperty.lengthPercentage,
  '2xl': atProperty.lengthPercentage,
  '3xl': atProperty.lengthPercentage,
} as const satisfies TokenSchema;
