import { atProperty, type TokenSchema } from 'typestyles';

/** Interactive navigation / menu row chrome (top nav, side nav, command palette, …). */
export const navItemTokenSchema = {
  foreground: atProperty.color,
  background: atProperty.color,
  hoverBackground: atProperty.color,
  activeBackground: atProperty.color,
  selectedBackground: atProperty.color,
  selectedForeground: atProperty.color,
} as const satisfies TokenSchema;
