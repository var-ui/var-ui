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
  | 'aspect-ratio.default'
  | 'heading.default'
  | 'text.default'
  | 'link.default'
  | 'code-block.default'
  | 'alert.default'
  | 'banner.default'
  | 'badge.default'
  | 'spinner.default'
  | 'progress-bar.default'
  | 'empty-state.default'
  | 'avatar.default'
  | 'card.default'
  | 'clickable-card.default'
  | 'carousel.default'
  | 'thumbnail.default'
  | 'timestamp.default'
  | 'field.default'
  | 'text-field.default'
  | 'text-area-field.default'
  | 'checkbox.default'
  | 'radio-group.default'
  | 'switch.default'
  | 'select.default'
  | 'select.options';

export type DemoSnippets = Record<DocsFramework, string>;

export type DemoEntry = {
  id: DemoId;
  snippets: DemoSnippets;
  react: () => Promise<{ default: ComponentType }>;
};
