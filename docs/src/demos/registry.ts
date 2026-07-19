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
