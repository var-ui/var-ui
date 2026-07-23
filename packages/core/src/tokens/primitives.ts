import { tokens } from '../runtime';
import { basePaletteTokenValues } from './palette';
import {
  borderWidthValues,
  durationValues,
  easingValues,
  fontFamilyValues,
  fontSizeValues,
  fontWeightValues,
  letterSpacingValues,
  lineHeightValues,
  opacityValues,
  radiusValues,
  shadowValues,
  sizeValues,
  spaceValues,
  transitionValues,
} from './primitive';

export const paletteTokens = tokens.create('palette', basePaletteTokenValues);
export const spaceTokens = tokens.create('space', spaceValues);
export const sizeTokens = tokens.create('size', sizeValues);
export const opacityTokens = tokens.create('opacity', opacityValues);
export const letterSpacingTokens = tokens.create('letterSpacing', letterSpacingValues);
export const radiusTokens = tokens.create('radius', radiusValues);
export const borderWidthTokens = tokens.create('borderWidth', borderWidthValues);
export const fontFamilyTokens = tokens.create('fontFamily', fontFamilyValues);
export const fontSizeTokens = tokens.create('fontSize', fontSizeValues);
export const fontWeightTokens = tokens.create('fontWeight', fontWeightValues);
export const lineHeightTokens = tokens.create('lineHeight', lineHeightValues);
export const shadowTokens = tokens.create('shadow', shadowValues);
export const durationTokens = tokens.create('duration', durationValues);
export const easingTokens = tokens.create('easing', easingValues);
export const transitionTokens = tokens.create('transition', transitionValues);
