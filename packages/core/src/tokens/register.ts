import { defaultLightColorValues } from '../themes/default-values';
import { buildColorRegistrationValues } from './color';
import {
  borderWidthTokens,
  breakpointTokens,
  durationTokens,
  easingTokens,
  fontFamilyTokens,
  fontSizeTokens,
  fontWeightTokens,
  letterSpacingTokens,
  lineHeightTokens,
  opacityTokens,
  paletteTokens,
  radiusTokens,
  shadowTokens,
  sizeTokens,
  spaceTokens,
  transitionTokens,
  zIndexTokens,
} from './primitives';
import { tokens } from '../runtime';

export const colorTokens = tokens.create(
  'color',
  buildColorRegistrationValues(defaultLightColorValues),
);

/** Full `border` / `border-*` shorthand built from width + semantic border color. */
export const strokeTokens = tokens.create('stroke', {
  default: `${borderWidthTokens.default} solid ${colorTokens.border.default}`,
  strong: `${borderWidthTokens.default} solid ${colorTokens.border.strong}`,
});

export const designTokens = {
  palette: paletteTokens,
  space: spaceTokens,
  size: sizeTokens,
  opacity: opacityTokens,
  letterSpacing: letterSpacingTokens,
  radius: radiusTokens,
  borderWidth: borderWidthTokens,
  fontFamily: fontFamilyTokens,
  fontSize: fontSizeTokens,
  fontWeight: fontWeightTokens,
  lineHeight: lineHeightTokens,
  shadow: shadowTokens,
  duration: durationTokens,
  easing: easingTokens,
  transition: transitionTokens,
  breakpoint: breakpointTokens,
  zIndex: zIndexTokens,
  color: colorTokens,
  stroke: strokeTokens,
} as const;
