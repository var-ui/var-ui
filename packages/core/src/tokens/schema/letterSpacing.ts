import { atProperty, type TokenSchema } from 'typestyles';

export const letterSpacingTokenSchema = {
  tight: atProperty.lengthPercentage,
  normal: atProperty.lengthPercentage,
  wide: atProperty.lengthPercentage,
  caps: atProperty.lengthPercentage,
} as const satisfies TokenSchema;
