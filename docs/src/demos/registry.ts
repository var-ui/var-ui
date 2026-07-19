import type { DemoEntry, DemoId, DemoSnippets } from './types';
import { snippets as buttonDefaultSnippets } from './button/default/snippets';
import { snippets as buttonDisabledSnippets } from './button/disabled/snippets';
import { snippets as buttonVariantsSnippets } from './button/variants/snippets';

export type { DemoEntry, DemoId, DemoSnippets };

export const DEMO_IDS = [
  'button.default',
  'button.variants',
  'button.disabled',
] as const satisfies readonly DemoId[];

export const demoSnippets: Record<DemoId, DemoSnippets> = {
  'button.default': buttonDefaultSnippets,
  'button.variants': buttonVariantsSnippets,
  'button.disabled': buttonDisabledSnippets,
};

export const reactDemoLoaders: Record<DemoId, DemoEntry['react']> = {
  'button.default': () => import('./button/default/react'),
  'button.variants': () => import('./button/variants/react'),
  'button.disabled': () => import('./button/disabled/react'),
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
