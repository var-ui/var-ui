import type { ComponentType } from 'react';
import type { DemoId } from './types';
import AlertDefault from './alert/default/react';
import AspectRatioDefault from './aspect-ratio/default/react';
import AvatarDefault from './avatar/default/react';
import BadgeDefault from './badge/default/react';
import BannerDefault from './banner/default/react';
import ButtonDefault from './button/default/react';
import ButtonDisabled from './button/disabled/react';
import ButtonVariants from './button/variants/react';
import CardDefault from './card/default/react';
import CarouselDefault from './carousel/default/react';
import CenterDefault from './center/default/react';
import ClickableCardDefault from './clickable-card/default/react';
import CodeBlockDefault from './code-block/default/react';
import DividerDefault from './divider/default/react';
import EmptyStateDefault from './empty-state/default/react';
import GridDefault from './grid/default/react';
import HeadingDefault from './heading/default/react';
import LinkDefault from './link/default/react';
import ProgressBarDefault from './progress-bar/default/react';
import SectionDefault from './section/default/react';
import SpinnerDefault from './spinner/default/react';
import StackDefault from './stack/default/react';
import TextDefault from './text/default/react';
import ThumbnailDefault from './thumbnail/default/react';
import TimestampDefault from './timestamp/default/react';
import FieldDefault from './field/default/react';
import TextFieldDefault from './text-field/default/react';
import TextAreaFieldDefault from './text-area-field/default/react';
import CheckboxDefault from './checkbox/default/react';
import RadioGroupDefault from './radio-group/default/react';
import SwitchDefault from './switch/default/react';
import SelectDefault from './select/default/react';
import SelectOptions from './select/options/react';
import TabsDefault from './tabs/default/react';
import DialogDefault from './dialog/default/react';
import ChatLayoutDefault from './chat-layout/default/react';
import ChatMessageListDefault from './chat-message-list/default/react';
import ChatMessageDefault from './chat-message/default/react';
import ChatMessageBubbleDefault from './chat-message-bubble/default/react';
import ChatMessageMetadataDefault from './chat-message-metadata/default/react';
import ChatComposerDefault from './chat-composer/default/react';
import ChatSendButtonDefault from './chat-send-button/default/react';
import ChatSystemMessageDefault from './chat-system-message/default/react';
import ChatToolCallsDefault from './chat-tool-calls/default/react';

/** Static React preview map — DemoReactIsland resolves demos by id (components are not serializable island props). */
export const reactDemoMap = {
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
  'tabs.default': TabsDefault,
  'dialog.default': DialogDefault,
  'chat-layout.default': ChatLayoutDefault,
  'chat-message-list.default': ChatMessageListDefault,
  'chat-message.default': ChatMessageDefault,
  'chat-message-bubble.default': ChatMessageBubbleDefault,
  'chat-message-metadata.default': ChatMessageMetadataDefault,
  'chat-composer.default': ChatComposerDefault,
  'chat-send-button.default': ChatSendButtonDefault,
  'chat-system-message.default': ChatSystemMessageDefault,
  'chat-tool-calls.default': ChatToolCallsDefault,
} as const satisfies Record<DemoId, ComponentType>;

export const reactDemoIds = Object.keys(reactDemoMap) as DemoId[];
