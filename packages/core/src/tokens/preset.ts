import { borderWidth } from './defaults/borderWidth';
import { breakpoint } from './defaults/breakpoint';
import { color } from './defaults/color';
import { duration } from './defaults/duration';
import { easing } from './defaults/easing';
import { fontFamily } from './defaults/fontFamily';
import { fontSize } from './defaults/fontSize';
import { fontWeight } from './defaults/fontWeight';
import { letterSpacing } from './defaults/letterSpacing';
import { lineHeight } from './defaults/lineHeight';
import { opacity } from './defaults/opacity';
import { radius } from './defaults/radius';
import { shadow } from './defaults/shadow';
import { size } from './defaults/size';
import { space } from './defaults/space';
import { stroke } from './defaults/stroke';
import { transition } from './defaults/transition';
import { zIndex } from './defaults/zIndex';
import { basePaletteTokenValues } from './palette';

/** Registered default token values (light color face). */
export const tokenValues = {
  palette: basePaletteTokenValues,
  space,
  size,
  opacity,
  letterSpacing,
  radius,
  borderWidth,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  shadow,
  duration,
  easing,
  transition,
  breakpoint,
  zIndex,
  stroke,
  color,
} as const;
