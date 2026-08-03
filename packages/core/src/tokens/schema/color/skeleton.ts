import { atProperty, type TokenSchema } from 'typestyles';

export const skeletonTokenSchema = {
  default: atProperty.color,
} as const satisfies TokenSchema;
