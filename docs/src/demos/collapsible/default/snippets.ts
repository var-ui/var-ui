import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Collapsible, CollapsibleGroup } from '@var-ui/react';

<CollapsibleGroup>
  <Collapsible id="a" title="Section A" variant="bordered">…</Collapsible>
  <Collapsible id="b" title="Section B" variant="bordered">…</Collapsible>
</CollapsibleGroup>`,
  astro: `---
import { Collapsible } from '@var-ui/astro';
---

<Collapsible title="Section" variant="bordered">…</Collapsible>`,
  html: `<details class="var-ui-collapsible">…</details>`,
} satisfies DemoSnippets;
