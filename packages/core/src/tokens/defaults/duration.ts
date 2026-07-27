import { expandDurationBand } from 'typestyles/token-scale';
import type { DesignTokens } from '../types';

const fastBand = expandDurationBand({ base: 80, ratio: 0.75 });
const mediumBand = expandDurationBand({ base: 140, ratio: 0.75 });
const slowBand = expandDurationBand({ base: 220, ratio: 0.75 });

export const duration = {
  fast: '80ms',
  medium: '140ms',
  slow: '220ms',
  'fast-min': `${fastBand.min}ms`,
  'fast-max': `${fastBand.max}ms`,
  'medium-min': `${mediumBand.min}ms`,
  'medium-max': `${mediumBand.max}ms`,
  'slow-min': `${slowBand.min}ms`,
  'slow-max': `${slowBand.max}ms`,
} satisfies DesignTokens['duration'];
