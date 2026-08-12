import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Skeleton } from '@var-ui/react';

<Skeleton shape="text" style={{ width: 120, height: 16 }} />`,
  astro: `---
import { Skeleton } from '@var-ui/astro';
---
<Skeleton shape="text" style="width: 120px; height: 16px;" />`,
  html: `<div class="var-ui-skeleton" data-shape="text" aria-hidden style="width: 120px; height: 16px;"></div>`,
} satisfies DemoSnippets;
