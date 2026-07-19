import type { DemoId } from './types';
import ButtonDefault from './button/default/astro.astro';
import ButtonDisabled from './button/disabled/astro.astro';
import ButtonVariants from './button/variants/astro.astro';

/** Static Astro preview map — DemoHost imports this (Astro cannot dynamic-import by string). */
export const astroDemoMap = {
  'button.default': ButtonDefault,
  'button.variants': ButtonVariants,
  'button.disabled': ButtonDisabled,
} as const satisfies Record<DemoId, unknown>;

export const astroDemoIds = Object.keys(astroDemoMap) as DemoId[];
