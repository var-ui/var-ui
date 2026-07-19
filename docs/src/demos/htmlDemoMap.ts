import type { DemoId } from './types';
import { render as renderAlertDefault } from './alert/default/html';
import { render as renderAspectRatioDefault } from './aspect-ratio/default/html';
import { render as renderAvatarDefault } from './avatar/default/html';
import { render as renderBadgeDefault } from './badge/default/html';
import { render as renderBannerDefault } from './banner/default/html';
import { render as renderButtonDefault } from './button/default/html';
import { render as renderButtonDisabled } from './button/disabled/html';
import { render as renderButtonVariants } from './button/variants/html';
import { render as renderCardDefault } from './card/default/html';
import { render as renderCarouselDefault } from './carousel/default/html';
import { render as renderCenterDefault } from './center/default/html';
import { render as renderClickableCardDefault } from './clickable-card/default/html';
import { render as renderCodeBlockDefault } from './code-block/default/html';
import { render as renderDividerDefault } from './divider/default/html';
import { render as renderEmptyStateDefault } from './empty-state/default/html';
import { render as renderGridDefault } from './grid/default/html';
import { render as renderHeadingDefault } from './heading/default/html';
import { render as renderLinkDefault } from './link/default/html';
import { render as renderProgressBarDefault } from './progress-bar/default/html';
import { render as renderSectionDefault } from './section/default/html';
import { render as renderSpinnerDefault } from './spinner/default/html';
import { render as renderStackDefault } from './stack/default/html';
import { render as renderTextDefault } from './text/default/html';
import { render as renderThumbnailDefault } from './thumbnail/default/html';
import { render as renderTimestampDefault } from './timestamp/default/html';
import { render as renderFieldDefault } from './field/default/html';
import { render as renderTextFieldDefault } from './text-field/default/html';
import { render as renderTextAreaFieldDefault } from './text-area-field/default/html';
import { render as renderCheckboxDefault } from './checkbox/default/html';
import { render as renderRadioGroupDefault } from './radio-group/default/html';
import { render as renderSwitchDefault } from './switch/default/html';
import { render as renderSelectDefault } from './select/default/html';
import { render as renderSelectOptions } from './select/options/html';

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
  'heading.default': renderHeadingDefault,
  'text.default': renderTextDefault,
  'link.default': renderLinkDefault,
  'code-block.default': renderCodeBlockDefault,
  'alert.default': renderAlertDefault,
  'banner.default': renderBannerDefault,
  'badge.default': renderBadgeDefault,
  'spinner.default': renderSpinnerDefault,
  'progress-bar.default': renderProgressBarDefault,
  'empty-state.default': renderEmptyStateDefault,
  'avatar.default': renderAvatarDefault,
  'card.default': renderCardDefault,
  'clickable-card.default': renderClickableCardDefault,
  'carousel.default': renderCarouselDefault,
  'thumbnail.default': renderThumbnailDefault,
  'timestamp.default': renderTimestampDefault,
  'field.default': renderFieldDefault,
  'text-field.default': renderTextFieldDefault,
  'text-area-field.default': renderTextAreaFieldDefault,
  'checkbox.default': renderCheckboxDefault,
  'radio-group.default': renderRadioGroupDefault,
  'switch.default': renderSwitchDefault,
  'select.default': renderSelectDefault,
  'select.options': renderSelectOptions,
} as const satisfies Record<DemoId, () => string>;

export const htmlDemoIds = Object.keys(htmlDemoMap) as DemoId[];
