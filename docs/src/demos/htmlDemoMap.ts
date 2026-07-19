import type { DemoId } from './types';
import { render as renderAspectRatioDefault } from './aspect-ratio/default/html';
import { render as renderButtonDefault } from './button/default/html';
import { render as renderButtonDisabled } from './button/disabled/html';
import { render as renderButtonVariants } from './button/variants/html';
import { render as renderCenterDefault } from './center/default/html';
import { render as renderDividerDefault } from './divider/default/html';
import { render as renderGridDefault } from './grid/default/html';
import { render as renderSectionDefault } from './section/default/html';
import { render as renderStackDefault } from './stack/default/html';

/** Static HTML preview renderers keyed by demo id — consumed by DemoHost. */
export const htmlDemoMap = {
  'button.default': renderButtonDefault,
  'button.variants': renderButtonVariants,
  'button.disabled': renderButtonDisabled,
  'stack.default': renderStackDefault,
  'grid.default': renderGridDefault,
  'center.default': renderCenterDefault,
  'section.default': renderSectionDefault,
  'divider.default': renderDividerDefault,
  'aspect-ratio.default': renderAspectRatioDefault,
} as const satisfies Record<DemoId, () => string>;

export const htmlDemoIds = Object.keys(htmlDemoMap) as DemoId[];
