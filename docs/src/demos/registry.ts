import type { DemoEntry, DemoId, DemoSnippets } from './types';
import { snippets as aspectRatioDefaultSnippets } from './aspect-ratio/default/snippets';
import { snippets as buttonDefaultSnippets } from './button/default/snippets';
import { snippets as buttonDisabledSnippets } from './button/disabled/snippets';
import { snippets as buttonVariantsSnippets } from './button/variants/snippets';
import { snippets as centerDefaultSnippets } from './center/default/snippets';
import { snippets as dividerDefaultSnippets } from './divider/default/snippets';
import { snippets as gridDefaultSnippets } from './grid/default/snippets';
import { snippets as sectionDefaultSnippets } from './section/default/snippets';
import { snippets as stackDefaultSnippets } from './stack/default/snippets';

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
