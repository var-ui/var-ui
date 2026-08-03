import type { TokenSchema } from 'typestyles';
import { borderWidthTokenSchema } from './borderWidth';
import { breakpointTokenSchema } from './breakpoint';
import { colorTokenSchema } from './color';
import { durationTokenSchema } from './duration';
import { easingTokenSchema } from './easing';
import { fontFamilyTokenSchema } from './fontFamily';
import { fontSizeTokenSchema } from './fontSize';
import { fontWeightTokenSchema } from './fontWeight';
import { letterSpacingTokenSchema } from './letterSpacing';
import { lineHeightTokenSchema } from './lineHeight';
import { opacityTokenSchema } from './opacity';
import { radiusTokenSchema } from './radius';
import { shadowTokenSchema } from './shadow';
import { sizeTokenSchema } from './size';
import { spaceTokenSchema } from './space';
import { strokeTokenSchema } from './stroke';
import { transitionTokenSchema } from './transition';
import { zIndexTokenSchema } from './zIndex';

/**
 * Schema for `tokens.declare('', …)`.
 * Leaves use `atProperty` presets so `@property` is emitted and refs expose `.var` for recipes.
 */
export const tokenSchema = {
  space: spaceTokenSchema,
  size: sizeTokenSchema,
  opacity: opacityTokenSchema,
  letterSpacing: letterSpacingTokenSchema,
  radius: radiusTokenSchema,
  borderWidth: borderWidthTokenSchema,
  fontFamily: fontFamilyTokenSchema,
  fontSize: fontSizeTokenSchema,
  fontWeight: fontWeightTokenSchema,
  lineHeight: lineHeightTokenSchema,
  shadow: shadowTokenSchema,
  duration: durationTokenSchema,
  easing: easingTokenSchema,
  transition: transitionTokenSchema,
  breakpoint: breakpointTokenSchema,
  zIndex: zIndexTokenSchema,
  color: colorTokenSchema,
  stroke: strokeTokenSchema,
} as const satisfies TokenSchema;
