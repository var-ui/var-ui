import { generateLinearScale } from 'typestyles/token-scale';
import type { DesignTokens } from '../types';

const RADIUS_STEPS = [1, 2, 3, 4] as const;
const RADIUS_NAMES = ['sm', 'md', 'lg', 'xl'] as const;
const radiusScale = generateLinearScale({
  base: 4,
  multiplier: 1.25,
  steps: [...RADIUS_STEPS],
});

function zipPx<T extends string>(names: readonly T[], values: number[]): Record<T, `${number}px`> {
  return Object.fromEntries(names.map((name, index) => [name, `${values[index]}px`])) as Record<
    T,
    `${number}px`
  >;
}

export const radius = {
  none: '0',
  ...zipPx(RADIUS_NAMES, radiusScale),
  full: '9999px',
} satisfies DesignTokens['radius'];
