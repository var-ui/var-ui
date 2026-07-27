import { color } from 'typestyles/color';

/** Perceptual mix with page background — neo-brutalist palette themes in this folder. */
const shadowOffsetLightAlpha = 0.5;

export function neoBrutalistShadowOffsetLight(subtleBackground: string): string {
  return color.alpha(subtleBackground, shadowOffsetLightAlpha, 'oklch');
}

export function neoBrutalistBorderDarkDefault(hue: number): string {
  return color.oklch('40%', 0.02, hue);
}

export function neoBrutalistBorderDarkStrong(hue: number): string {
  return color.oklch('54%', 0.026, hue);
}

export function neoBrutalistShadowOffsetDark(hue: number): string {
  return color.oklch('6.5%', 0.035, hue);
}
