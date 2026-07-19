import type { ComponentType } from 'react';
import type { DocsFramework } from '../lib/framework';

export type DemoId = 'button.default' | 'button.variants' | 'button.disabled';

export type DemoSnippets = Record<DocsFramework, string>;

export type DemoEntry = {
  id: DemoId;
  snippets: DemoSnippets;
  react: () => Promise<{ default: ComponentType }>;
};
