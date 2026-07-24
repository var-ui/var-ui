import { atProperty, type TokenSchema } from 'typestyles';

export const durationTokenSchema = {
  fast: atProperty.time,
  medium: atProperty.time,
  slow: atProperty.time,
  'fast-min': atProperty.time,
  'fast-max': atProperty.time,
  'medium-min': atProperty.time,
  'medium-max': atProperty.time,
  'slow-min': atProperty.time,
  'slow-max': atProperty.time,
} as const satisfies TokenSchema;
