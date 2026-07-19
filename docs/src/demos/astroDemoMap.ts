import type { DemoId } from './types';
import AspectRatioDefault from './aspect-ratio/default/astro.astro';
import ButtonDefault from './button/default/astro.astro';
import ButtonDisabled from './button/disabled/astro.astro';
import ButtonVariants from './button/variants/astro.astro';
import CenterDefault from './center/default/astro.astro';
import DividerDefault from './divider/default/astro.astro';
import GridDefault from './grid/default/astro.astro';
import SectionDefault from './section/default/astro.astro';
import StackDefault from './stack/default/astro.astro';

/** Static Astro preview map — DemoHost imports this (Astro cannot dynamic-import by string). */
export const astroDemoMap = {
  'button.default': ButtonDefault,
  'button.variants': ButtonVariants,
  'button.disabled': ButtonDisabled,
  'stack.default': StackDefault,
  'grid.default': GridDefault,
  'center.default': CenterDefault,
  'section.default': SectionDefault,
  'divider.default': DividerDefault,
  'aspect-ratio.default': AspectRatioDefault,
} as const satisfies Record<DemoId, unknown>;

export const astroDemoIds = Object.keys(astroDemoMap) as DemoId[];
