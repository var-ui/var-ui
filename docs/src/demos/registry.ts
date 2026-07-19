import type { DemoEntry, DemoId, DemoSnippets } from './types';
import { snippets as alertDefaultSnippets } from './alert/default/snippets';
import { snippets as aspectRatioDefaultSnippets } from './aspect-ratio/default/snippets';
import { snippets as avatarDefaultSnippets } from './avatar/default/snippets';
import { snippets as badgeDefaultSnippets } from './badge/default/snippets';
import { snippets as bannerDefaultSnippets } from './banner/default/snippets';
import { snippets as buttonDefaultSnippets } from './button/default/snippets';
import { snippets as buttonDisabledSnippets } from './button/disabled/snippets';
import { snippets as buttonVariantsSnippets } from './button/variants/snippets';
import { snippets as cardDefaultSnippets } from './card/default/snippets';
import { snippets as carouselDefaultSnippets } from './carousel/default/snippets';
import { snippets as centerDefaultSnippets } from './center/default/snippets';
import { snippets as clickableCardDefaultSnippets } from './clickable-card/default/snippets';
import { snippets as codeBlockDefaultSnippets } from './code-block/default/snippets';
import { snippets as dividerDefaultSnippets } from './divider/default/snippets';
import { snippets as emptyStateDefaultSnippets } from './empty-state/default/snippets';
import { snippets as gridDefaultSnippets } from './grid/default/snippets';
import { snippets as headingDefaultSnippets } from './heading/default/snippets';
import { snippets as linkDefaultSnippets } from './link/default/snippets';
import { snippets as progressBarDefaultSnippets } from './progress-bar/default/snippets';
import { snippets as sectionDefaultSnippets } from './section/default/snippets';
import { snippets as spinnerDefaultSnippets } from './spinner/default/snippets';
import { snippets as stackDefaultSnippets } from './stack/default/snippets';
import { snippets as textDefaultSnippets } from './text/default/snippets';
import { snippets as thumbnailDefaultSnippets } from './thumbnail/default/snippets';
import { snippets as timestampDefaultSnippets } from './timestamp/default/snippets';
import { snippets as fieldDefaultSnippets } from './field/default/snippets';
import { snippets as textFieldDefaultSnippets } from './text-field/default/snippets';
import { snippets as textAreaFieldDefaultSnippets } from './text-area-field/default/snippets';
import { snippets as checkboxDefaultSnippets } from './checkbox/default/snippets';
import { snippets as radioGroupDefaultSnippets } from './radio-group/default/snippets';
import { snippets as switchDefaultSnippets } from './switch/default/snippets';
import { snippets as selectDefaultSnippets } from './select/default/snippets';
import { snippets as selectOptionsSnippets } from './select/options/snippets';
import { snippets as tabsDefaultSnippets } from './tabs/default/snippets';
import { snippets as dialogDefaultSnippets } from './dialog/default/snippets';
import { snippets as chatLayoutDefaultSnippets } from './chat-layout/default/snippets';
import { snippets as chatMessageListDefaultSnippets } from './chat-message-list/default/snippets';
import { snippets as chatMessageDefaultSnippets } from './chat-message/default/snippets';
import { snippets as chatMessageBubbleDefaultSnippets } from './chat-message-bubble/default/snippets';
import { snippets as chatMessageMetadataDefaultSnippets } from './chat-message-metadata/default/snippets';
import { snippets as chatComposerDefaultSnippets } from './chat-composer/default/snippets';
import { snippets as chatSendButtonDefaultSnippets } from './chat-send-button/default/snippets';
import { snippets as chatSystemMessageDefaultSnippets } from './chat-system-message/default/snippets';
import { snippets as chatToolCallsDefaultSnippets } from './chat-tool-calls/default/snippets';

export type { DemoEntry, DemoId, DemoSnippets };

export const DEMO_IDS = [
  'button.default',
  'button.variants',
  'button.disabled',
  'stack.default',
  'grid.default',
  'center.default',
  'section.default',
  'divider.default',
  'aspect-ratio.default',
  'heading.default',
  'text.default',
  'link.default',
  'code-block.default',
  'alert.default',
  'banner.default',
  'badge.default',
  'spinner.default',
  'progress-bar.default',
  'empty-state.default',
  'avatar.default',
  'card.default',
  'clickable-card.default',
  'carousel.default',
  'thumbnail.default',
  'timestamp.default',
  'field.default',
  'text-field.default',
  'text-area-field.default',
  'checkbox.default',
  'radio-group.default',
  'switch.default',
  'select.default',
  'select.options',
  'tabs.default',
  'dialog.default',
  'chat-layout.default',
  'chat-message-list.default',
  'chat-message.default',
  'chat-message-bubble.default',
  'chat-message-metadata.default',
  'chat-composer.default',
  'chat-send-button.default',
  'chat-system-message.default',
  'chat-tool-calls.default',
] as const satisfies readonly DemoId[];

export const demoSnippets: Record<DemoId, DemoSnippets> = {
  'button.default': buttonDefaultSnippets,
  'button.variants': buttonVariantsSnippets,
  'button.disabled': buttonDisabledSnippets,
  'stack.default': stackDefaultSnippets,
  'grid.default': gridDefaultSnippets,
  'center.default': centerDefaultSnippets,
  'section.default': sectionDefaultSnippets,
  'divider.default': dividerDefaultSnippets,
  'aspect-ratio.default': aspectRatioDefaultSnippets,
  'heading.default': headingDefaultSnippets,
  'text.default': textDefaultSnippets,
  'link.default': linkDefaultSnippets,
  'code-block.default': codeBlockDefaultSnippets,
  'alert.default': alertDefaultSnippets,
  'banner.default': bannerDefaultSnippets,
  'badge.default': badgeDefaultSnippets,
  'spinner.default': spinnerDefaultSnippets,
  'progress-bar.default': progressBarDefaultSnippets,
  'empty-state.default': emptyStateDefaultSnippets,
  'avatar.default': avatarDefaultSnippets,
  'card.default': cardDefaultSnippets,
  'clickable-card.default': clickableCardDefaultSnippets,
  'carousel.default': carouselDefaultSnippets,
  'thumbnail.default': thumbnailDefaultSnippets,
  'timestamp.default': timestampDefaultSnippets,
  'field.default': fieldDefaultSnippets,
  'text-field.default': textFieldDefaultSnippets,
  'text-area-field.default': textAreaFieldDefaultSnippets,
  'checkbox.default': checkboxDefaultSnippets,
  'radio-group.default': radioGroupDefaultSnippets,
  'switch.default': switchDefaultSnippets,
  'select.default': selectDefaultSnippets,
  'select.options': selectOptionsSnippets,
  'tabs.default': tabsDefaultSnippets,
  'dialog.default': dialogDefaultSnippets,
  'chat-layout.default': chatLayoutDefaultSnippets,
  'chat-message-list.default': chatMessageListDefaultSnippets,
  'chat-message.default': chatMessageDefaultSnippets,
  'chat-message-bubble.default': chatMessageBubbleDefaultSnippets,
  'chat-message-metadata.default': chatMessageMetadataDefaultSnippets,
  'chat-composer.default': chatComposerDefaultSnippets,
  'chat-send-button.default': chatSendButtonDefaultSnippets,
  'chat-system-message.default': chatSystemMessageDefaultSnippets,
  'chat-tool-calls.default': chatToolCallsDefaultSnippets,
};

export const reactDemoLoaders: Record<DemoId, DemoEntry['react']> = {
  'button.default': () => import('./button/default/react'),
  'button.variants': () => import('./button/variants/react'),
  'button.disabled': () => import('./button/disabled/react'),
  'stack.default': () => import('./stack/default/react'),
  'grid.default': () => import('./grid/default/react'),
  'center.default': () => import('./center/default/react'),
  'section.default': () => import('./section/default/react'),
  'divider.default': () => import('./divider/default/react'),
  'aspect-ratio.default': () => import('./aspect-ratio/default/react'),
  'heading.default': () => import('./heading/default/react'),
  'text.default': () => import('./text/default/react'),
  'link.default': () => import('./link/default/react'),
  'code-block.default': () => import('./code-block/default/react'),
  'alert.default': () => import('./alert/default/react'),
  'banner.default': () => import('./banner/default/react'),
  'badge.default': () => import('./badge/default/react'),
  'spinner.default': () => import('./spinner/default/react'),
  'progress-bar.default': () => import('./progress-bar/default/react'),
  'empty-state.default': () => import('./empty-state/default/react'),
  'avatar.default': () => import('./avatar/default/react'),
  'card.default': () => import('./card/default/react'),
  'clickable-card.default': () => import('./clickable-card/default/react'),
  'carousel.default': () => import('./carousel/default/react'),
  'thumbnail.default': () => import('./thumbnail/default/react'),
  'timestamp.default': () => import('./timestamp/default/react'),
  'field.default': () => import('./field/default/react'),
  'text-field.default': () => import('./text-field/default/react'),
  'text-area-field.default': () => import('./text-area-field/default/react'),
  'checkbox.default': () => import('./checkbox/default/react'),
  'radio-group.default': () => import('./radio-group/default/react'),
  'switch.default': () => import('./switch/default/react'),
  'select.default': () => import('./select/default/react'),
  'select.options': () => import('./select/options/react'),
  'tabs.default': () => import('./tabs/default/react'),
  'dialog.default': () => import('./dialog/default/react'),
  'chat-layout.default': () => import('./chat-layout/default/react'),
  'chat-message-list.default': () => import('./chat-message-list/default/react'),
  'chat-message.default': () => import('./chat-message/default/react'),
  'chat-message-bubble.default': () => import('./chat-message-bubble/default/react'),
  'chat-message-metadata.default': () => import('./chat-message-metadata/default/react'),
  'chat-composer.default': () => import('./chat-composer/default/react'),
  'chat-send-button.default': () => import('./chat-send-button/default/react'),
  'chat-system-message.default': () => import('./chat-system-message/default/react'),
  'chat-tool-calls.default': () => import('./chat-tool-calls/default/react'),
};

export const demoRegistry: Record<DemoId, DemoEntry> = {
  'button.default': {
    id: 'button.default',
    snippets: demoSnippets['button.default'],
    react: reactDemoLoaders['button.default'],
  },
  'button.variants': {
    id: 'button.variants',
    snippets: demoSnippets['button.variants'],
    react: reactDemoLoaders['button.variants'],
  },
  'button.disabled': {
    id: 'button.disabled',
    snippets: demoSnippets['button.disabled'],
    react: reactDemoLoaders['button.disabled'],
  },
  'stack.default': {
    id: 'stack.default',
    snippets: demoSnippets['stack.default'],
    react: reactDemoLoaders['stack.default'],
  },
  'grid.default': {
    id: 'grid.default',
    snippets: demoSnippets['grid.default'],
    react: reactDemoLoaders['grid.default'],
  },
  'center.default': {
    id: 'center.default',
    snippets: demoSnippets['center.default'],
    react: reactDemoLoaders['center.default'],
  },
  'section.default': {
    id: 'section.default',
    snippets: demoSnippets['section.default'],
    react: reactDemoLoaders['section.default'],
  },
  'divider.default': {
    id: 'divider.default',
    snippets: demoSnippets['divider.default'],
    react: reactDemoLoaders['divider.default'],
  },
  'aspect-ratio.default': {
    id: 'aspect-ratio.default',
    snippets: demoSnippets['aspect-ratio.default'],
    react: reactDemoLoaders['aspect-ratio.default'],
  },
  'heading.default': {
    id: 'heading.default',
    snippets: demoSnippets['heading.default'],
    react: reactDemoLoaders['heading.default'],
  },
  'text.default': {
    id: 'text.default',
    snippets: demoSnippets['text.default'],
    react: reactDemoLoaders['text.default'],
  },
  'link.default': {
    id: 'link.default',
    snippets: demoSnippets['link.default'],
    react: reactDemoLoaders['link.default'],
  },
  'code-block.default': {
    id: 'code-block.default',
    snippets: demoSnippets['code-block.default'],
    react: reactDemoLoaders['code-block.default'],
  },
  'alert.default': {
    id: 'alert.default',
    snippets: demoSnippets['alert.default'],
    react: reactDemoLoaders['alert.default'],
  },
  'banner.default': {
    id: 'banner.default',
    snippets: demoSnippets['banner.default'],
    react: reactDemoLoaders['banner.default'],
  },
  'badge.default': {
    id: 'badge.default',
    snippets: demoSnippets['badge.default'],
    react: reactDemoLoaders['badge.default'],
  },
  'spinner.default': {
    id: 'spinner.default',
    snippets: demoSnippets['spinner.default'],
    react: reactDemoLoaders['spinner.default'],
  },
  'progress-bar.default': {
    id: 'progress-bar.default',
    snippets: demoSnippets['progress-bar.default'],
    react: reactDemoLoaders['progress-bar.default'],
  },
  'empty-state.default': {
    id: 'empty-state.default',
    snippets: demoSnippets['empty-state.default'],
    react: reactDemoLoaders['empty-state.default'],
  },
  'avatar.default': {
    id: 'avatar.default',
    snippets: demoSnippets['avatar.default'],
    react: reactDemoLoaders['avatar.default'],
  },
  'card.default': {
    id: 'card.default',
    snippets: demoSnippets['card.default'],
    react: reactDemoLoaders['card.default'],
  },
  'clickable-card.default': {
    id: 'clickable-card.default',
    snippets: demoSnippets['clickable-card.default'],
    react: reactDemoLoaders['clickable-card.default'],
  },
  'carousel.default': {
    id: 'carousel.default',
    snippets: demoSnippets['carousel.default'],
    react: reactDemoLoaders['carousel.default'],
  },
  'thumbnail.default': {
    id: 'thumbnail.default',
    snippets: demoSnippets['thumbnail.default'],
    react: reactDemoLoaders['thumbnail.default'],
  },
  'timestamp.default': {
    id: 'timestamp.default',
    snippets: demoSnippets['timestamp.default'],
    react: reactDemoLoaders['timestamp.default'],
  },
  'field.default': {
    id: 'field.default',
    snippets: demoSnippets['field.default'],
    react: reactDemoLoaders['field.default'],
  },
  'text-field.default': {
    id: 'text-field.default',
    snippets: demoSnippets['text-field.default'],
    react: reactDemoLoaders['text-field.default'],
  },
  'text-area-field.default': {
    id: 'text-area-field.default',
    snippets: demoSnippets['text-area-field.default'],
    react: reactDemoLoaders['text-area-field.default'],
  },
  'checkbox.default': {
    id: 'checkbox.default',
    snippets: demoSnippets['checkbox.default'],
    react: reactDemoLoaders['checkbox.default'],
  },
  'radio-group.default': {
    id: 'radio-group.default',
    snippets: demoSnippets['radio-group.default'],
    react: reactDemoLoaders['radio-group.default'],
  },
  'switch.default': {
    id: 'switch.default',
    snippets: demoSnippets['switch.default'],
    react: reactDemoLoaders['switch.default'],
  },
  'select.default': {
    id: 'select.default',
    snippets: demoSnippets['select.default'],
    react: reactDemoLoaders['select.default'],
  },
  'select.options': {
    id: 'select.options',
    snippets: demoSnippets['select.options'],
    react: reactDemoLoaders['select.options'],
  },
  'tabs.default': {
    id: 'tabs.default',
    snippets: demoSnippets['tabs.default'],
    react: reactDemoLoaders['tabs.default'],
  },
  'dialog.default': {
    id: 'dialog.default',
    snippets: demoSnippets['dialog.default'],
    react: reactDemoLoaders['dialog.default'],
  },
  'chat-layout.default': {
    id: 'chat-layout.default',
    snippets: demoSnippets['chat-layout.default'],
    react: reactDemoLoaders['chat-layout.default'],
  },
  'chat-message-list.default': {
    id: 'chat-message-list.default',
    snippets: demoSnippets['chat-message-list.default'],
    react: reactDemoLoaders['chat-message-list.default'],
  },
  'chat-message.default': {
    id: 'chat-message.default',
    snippets: demoSnippets['chat-message.default'],
    react: reactDemoLoaders['chat-message.default'],
  },
  'chat-message-bubble.default': {
    id: 'chat-message-bubble.default',
    snippets: demoSnippets['chat-message-bubble.default'],
    react: reactDemoLoaders['chat-message-bubble.default'],
  },
  'chat-message-metadata.default': {
    id: 'chat-message-metadata.default',
    snippets: demoSnippets['chat-message-metadata.default'],
    react: reactDemoLoaders['chat-message-metadata.default'],
  },
  'chat-composer.default': {
    id: 'chat-composer.default',
    snippets: demoSnippets['chat-composer.default'],
    react: reactDemoLoaders['chat-composer.default'],
  },
  'chat-send-button.default': {
    id: 'chat-send-button.default',
    snippets: demoSnippets['chat-send-button.default'],
    react: reactDemoLoaders['chat-send-button.default'],
  },
  'chat-system-message.default': {
    id: 'chat-system-message.default',
    snippets: demoSnippets['chat-system-message.default'],
    react: reactDemoLoaders['chat-system-message.default'],
  },
  'chat-tool-calls.default': {
    id: 'chat-tool-calls.default',
    snippets: demoSnippets['chat-tool-calls.default'],
    react: reactDemoLoaders['chat-tool-calls.default'],
  },
};

export function assertDemoComplete(entry: DemoEntry): void {
  for (const framework of ['react', 'astro', 'html'] as const) {
    if (!entry.snippets[framework]?.length) {
      throw new Error(`Demo "${entry.id}" missing ${framework} snippet`);
    }
  }
  if (typeof entry.react !== 'function') {
    throw new Error(`Demo "${entry.id}" missing react loader`);
  }
}
