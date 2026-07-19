import type { ComponentType } from 'react';
import type { DocsFramework } from '../lib/framework';

export type DemoId =
  | 'button.default'
  | 'button.variants'
  | 'button.disabled'
  | 'stack.default'
  | 'grid.default'
  | 'center.default'
  | 'section.default'
  | 'divider.default'
  | 'aspect-ratio.default';

export type DemoSnippets = Record<DocsFramework, string>;

export type DemoEntry = {
  id: DemoId;
  snippets: DemoSnippets;
  react: () => Promise<{ default: ComponentType }>;
};
