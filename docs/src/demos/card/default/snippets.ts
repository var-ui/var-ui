import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Card } from '@var-ui/react';

<Card title="Static card">Plain content surface.</Card>`,
  astro: `---
import { Card } from '@var-ui/astro';
---

<Card title="Static card">Plain content surface.</Card>`,
  html: `<div class="var-ui-card"><h3 class="var-ui-card__title">Static card</h3><div class="var-ui-card__body">Plain content surface.</div></div>`,
} satisfies DemoSnippets;
