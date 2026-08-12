import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ScrollArea } from '@var-ui/react';

<ScrollArea style={{ height: 120, width: 240 }}>
  <p>Long content…</p>
</ScrollArea>`,
  astro: `---
import { ScrollArea } from '@var-ui/astro';
---
<ScrollArea className="demo-scroll">…</ScrollArea>`,
  html: `<div class="var-ui-scroll-area" style="height: 120px; width: 240px;">…</div>`,
} satisfies DemoSnippets;
