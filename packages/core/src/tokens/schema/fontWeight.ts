import { atProperty, type TokenSchema } from 'typestyles';

export const fontWeightTokenSchema = {
  normal: atProperty.number,
  medium: atProperty.number,
  semibold: atProperty.number,
  bold: atProperty.number,
} as const satisfies TokenSchema;
