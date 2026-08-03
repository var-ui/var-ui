import type { SemanticColorTokens } from '../../types';
import { accent, darkAccent } from './accent';
import { background, darkBackground } from './background';
import { border, darkBorder } from './border';
import { code, darkCode } from './code';
import { danger, darkDanger } from './danger';
import { info, darkInfo } from './info';
import { link, darkLink } from './link';
import { navItem, darkNavItem } from './navItem';
import { overlay, darkOverlay } from './overlay';
import { ring, darkRing } from './ring';
import { skeleton, darkSkeleton } from './skeleton';
import { success, darkSuccess } from './success';
import { text, darkText } from './text';
import { track, darkTrack } from './track';
import { warning, darkWarning } from './warning';

export { lightCodeValues, darkCodeValues } from './code';

export const color = {
  background,
  text,
  accent,
  border,
  danger,
  success,
  warning,
  info,
  link,
  navItem,
  ring,
  overlay,
  skeleton,
  track,
  code,
} satisfies SemanticColorTokens;

export const dark = {
  background: darkBackground,
  text: darkText,
  accent: darkAccent,
  border: darkBorder,
  danger: darkDanger,
  success: darkSuccess,
  warning: darkWarning,
  info: darkInfo,
  link: darkLink,
  navItem: darkNavItem,
  ring: darkRing,
  overlay: darkOverlay,
  skeleton: darkSkeleton,
  track: darkTrack,
  code: darkCode,
} satisfies SemanticColorTokens;

export const lightSyntaxValues = code;
export const darkSyntaxValues = darkCode;
