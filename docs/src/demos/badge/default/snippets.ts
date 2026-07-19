import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Badge } from '@var-ui/react';

<Badge tone="accent">Beta</Badge>`,
  astro: `---
import { Badge } from '@var-ui/astro';
---

<Badge tone="accent">Beta</Badge>`,
  html: `<span data-tone="accent" class="var-ui-badge">Beta</span>`,
} satisfies DemoSnippets;
