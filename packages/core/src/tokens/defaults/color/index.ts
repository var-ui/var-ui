import type { DesignColorValues, SemanticColorTokens } from '../../types';
import { background, darkBackground } from './background';
import { border, darkBorder } from './border';
import { code, darkCode } from './code';
import { link, darkLink } from './link';
import { navItem, darkNavItem } from './navItem';
import { overlay, darkOverlay } from './overlay';
import { ring, darkRing } from './ring';
import { skeleton, darkSkeleton } from './skeleton';
import { text, darkText } from './text';
import { tone } from './tone';
import { track, darkTrack } from './track';

export { lightCodeValues, darkCodeValues } from './code';

export const color: Omit<SemanticColorTokens, 'tone'> & Pick<DesignColorValues, 'tone'> = {
  background,
  text,
  tone,
  border,
  link,
  navItem,
  ring,
  overlay,
  skeleton,
  track,
  code,
};

export const dark: Partial<SemanticColorTokens> = {
  background: darkBackground,
  text: darkText,
  border: darkBorder,
  link: darkLink,
  navItem: darkNavItem,
  ring: darkRing,
  overlay: darkOverlay,
  skeleton: darkSkeleton,
  track: darkTrack,
  code: darkCode,
};

export const lightSyntaxValues: SemanticColorTokens['code'] = code;
export const darkSyntaxValues: SemanticColorTokens['code'] = darkCode;
