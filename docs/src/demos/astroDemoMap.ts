import type { DemoId } from './types';
import AlertDefault from './alert/default/astro.astro';
import AspectRatioDefault from './aspect-ratio/default/astro.astro';
import AvatarDefault from './avatar/default/astro.astro';
import BadgeDefault from './badge/default/astro.astro';
import BannerDefault from './banner/default/astro.astro';
import ButtonDefault from './button/default/astro.astro';
import ButtonDisabled from './button/disabled/astro.astro';
import ButtonVariants from './button/variants/astro.astro';
import CardDefault from './card/default/astro.astro';
import CarouselDefault from './carousel/default/astro.astro';
import CenterDefault from './center/default/astro.astro';
import ClickableCardDefault from './clickable-card/default/astro.astro';
import CodeBlockDefault from './code-block/default/astro.astro';
import DividerDefault from './divider/default/astro.astro';
import EmptyStateDefault from './empty-state/default/astro.astro';
import GridDefault from './grid/default/astro.astro';
import HeadingDefault from './heading/default/astro.astro';
import LinkDefault from './link/default/astro.astro';
import ProgressBarDefault from './progress-bar/default/astro.astro';
import SectionDefault from './section/default/astro.astro';
import SpinnerDefault from './spinner/default/astro.astro';
import StackDefault from './stack/default/astro.astro';
import TextDefault from './text/default/astro.astro';
import ThumbnailDefault from './thumbnail/default/astro.astro';
import TimestampDefault from './timestamp/default/astro.astro';
import FieldDefault from './field/default/astro.astro';
import TextFieldDefault from './text-field/default/astro.astro';
import TextAreaFieldDefault from './text-area-field/default/astro.astro';
import CheckboxDefault from './checkbox/default/astro.astro';
import RadioGroupDefault from './radio-group/default/astro.astro';
import SwitchDefault from './switch/default/astro.astro';
import SelectDefault from './select/default/astro.astro';
import SelectOptions from './select/options/astro.astro';

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
  'heading.default': HeadingDefault,
  'text.default': TextDefault,
  'link.default': LinkDefault,
  'code-block.default': CodeBlockDefault,
  'alert.default': AlertDefault,
  'banner.default': BannerDefault,
  'badge.default': BadgeDefault,
  'spinner.default': SpinnerDefault,
  'progress-bar.default': ProgressBarDefault,
  'empty-state.default': EmptyStateDefault,
  'avatar.default': AvatarDefault,
  'card.default': CardDefault,
  'clickable-card.default': ClickableCardDefault,
  'carousel.default': CarouselDefault,
  'thumbnail.default': ThumbnailDefault,
  'timestamp.default': TimestampDefault,
  'field.default': FieldDefault,
  'text-field.default': TextFieldDefault,
  'text-area-field.default': TextAreaFieldDefault,
  'checkbox.default': CheckboxDefault,
  'radio-group.default': RadioGroupDefault,
  'switch.default': SwitchDefault,
  'select.default': SelectDefault,
  'select.options': SelectOptions,
} as const satisfies Record<DemoId, unknown>;

export const astroDemoIds = Object.keys(astroDemoMap) as DemoId[];
