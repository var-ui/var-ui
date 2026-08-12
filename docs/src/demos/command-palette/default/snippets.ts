import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CommandPalette } from '@var-ui/react';

<CommandPalette
  isOpen={open}
  onOpenChange={setOpen}
  items={[{ id: 'docs', title: 'Docs', meta: 'Guides' }]}
  onAction={() => setOpen(false)}
/>`,
  astro: `---
import { CommandPalette } from '@var-ui/astro';
---
<CommandPalette
  id="docs-command-palette"
  items={[{ id: 'docs', title: 'Docs', meta: 'Guides' }]}
/>`,
  html: `<div data-var-ui-command-palette-root id="docs-command-palette">…</div>`,
} satisfies DemoSnippets;
