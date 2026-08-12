import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SearchInput } from '@var-ui/react';

<SearchInput placeholder="Search…" aria-label="Search" />`,
  astro: `---
import { SearchInput } from '@var-ui/astro';
---
<SearchInput placeholder="Search…" aria-label="Search" />`,
  html: `<div class="var-ui-search-input" data-var-ui-search-input data-variant="default">…</div>`,
} satisfies DemoSnippets;
