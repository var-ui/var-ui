import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { AspectRatio } from '@var-ui/react';

<AspectRatio
  ratio={16 / 9}
  style={{ background: 'var(--color-surface-muted)', maxWidth: '320px' }}
/>`,
  astro: `---
import { AspectRatio } from '@var-ui/astro';
---

<AspectRatio ratio={16 / 9} className="aspect-ratio-demo" />

<style>
  .aspect-ratio-demo {
    background: var(--color-surface-muted);
    max-width: 320px;
  }
</style>`,
  html: `<div class="var-ui-aspect-ratio" style="background: var(--color-surface-muted); max-width: 320px; aspect-ratio: 1.7777777777777777"></div>`,
} satisfies DemoSnippets;
