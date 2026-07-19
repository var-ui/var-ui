import type { DemoId } from './types';
import { render as renderButtonDefault } from './button/default/html';
import { render as renderButtonDisabled } from './button/disabled/html';
import { render as renderButtonVariants } from './button/variants/html';

/** Static HTML preview renderers keyed by demo id — consumed by DemoHost. */
export const htmlDemoMap = {
  'button.default': renderButtonDefault,
  'button.variants': renderButtonVariants,
  'button.disabled': renderButtonDisabled,
} as const satisfies Record<DemoId, () => string>;

export const htmlDemoIds = Object.keys(htmlDemoMap) as DemoId[];
