import type { TokenSchema } from 'typestyles';

export const transitionTokenSchema = {
  overlayFade: { syntax: '*' },
  panelEnter: { syntax: '*' },
  backdrop: { syntax: '*' },
  surfaceFast: { syntax: '*' },
  colorShift: { syntax: '*' },
  controlSurface: { syntax: '*' },
} as const satisfies TokenSchema;
