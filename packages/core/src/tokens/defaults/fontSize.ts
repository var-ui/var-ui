import { generateGeometricScale } from 'typestyles/token-scale';
import type { DesignTokens } from '../types';

const FONT_SIZE_STEPS = [-2, -1, 0, 1, 2, 3, 4] as const;
const FONT_SIZE_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
const fontSizeScale = generateGeometricScale({
  base: 14,
  ratio: 1.2,
  steps: [...FONT_SIZE_STEPS],
});

function zipPx<T extends string>(names: readonly T[], values: number[]): Record<T, `${number}px`> {
  return Object.fromEntries(names.map((name, index) => [name, `${values[index]}px`])) as Record<
    T,
    `${number}px`
  >;
}

export const fontSize = zipPx(FONT_SIZE_NAMES, fontSizeScale) satisfies DesignTokens['fontSize'];
