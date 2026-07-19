import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Spinner } from '@var-ui/react';

<Spinner label="Loading results" />`,
  astro: `---
import { Spinner } from '@var-ui/astro';
---

<Spinner label="Loading results" />`,
  html: `<span role="status"><span data-size="md" data-tone="accent" class="var-ui-spinner" aria-hidden="true"></span><span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0">Loading results</span></span>`,
} satisfies DemoSnippets;
