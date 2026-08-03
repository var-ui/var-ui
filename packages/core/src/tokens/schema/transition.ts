import type { TokenSchema } from 'typestyles';
import { customToken } from './custom';

export const transitionTokenSchema = {
  overlayFade: customToken,
  panelEnter: customToken,
  backdrop: customToken,
  surfaceFast: customToken,
  colorShift: customToken,
  controlSurface: customToken,
} as const satisfies TokenSchema;
