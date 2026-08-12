import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Kbd } from '@var-ui/react';

<span>
  Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
</span>`,
  astro: `---
import { Kbd } from '@var-ui/astro';
---
<span>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd></span>`,
  html: `<span>Press <kbd class="var-ui-kbd">⌘</kbd> <kbd class="var-ui-kbd">K</kbd></span>`,
} satisfies DemoSnippets;
