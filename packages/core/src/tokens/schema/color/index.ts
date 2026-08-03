import type { TokenSchema } from 'typestyles';
import { accentTokenSchema } from './accent';
import { backgroundTokenSchema } from './background';
import { borderTokenSchema } from './border';
import { codeTokenSchema } from './code';
import { dangerTokenSchema } from './danger';
import { infoTokenSchema } from './info';
import { linkTokenSchema } from './link';
import { navItemTokenSchema } from './navItem';
import { overlayTokenSchema } from './overlay';
import { paletteTokenSchema } from './palette';
import { ringTokenSchema } from './ring';
import { skeletonTokenSchema } from './skeleton';
import { successTokenSchema } from './success';
import { textTokenSchema } from './text';
import { trackTokenSchema } from './track';
import { warningTokenSchema } from './warning';

export const colorTokenSchema = {
  palette: paletteTokenSchema,
  background: backgroundTokenSchema,
  text: textTokenSchema,
  accent: accentTokenSchema,
  border: borderTokenSchema,
  danger: dangerTokenSchema,
  success: successTokenSchema,
  warning: warningTokenSchema,
  info: infoTokenSchema,
  link: linkTokenSchema,
  navItem: navItemTokenSchema,
  ring: ringTokenSchema,
  overlay: overlayTokenSchema,
  skeleton: skeletonTokenSchema,
  track: trackTokenSchema,
  code: codeTokenSchema,
} as const satisfies TokenSchema;
