import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Heading } from '@var-ui/react';

<Heading level={2}>Section title</Heading>`,
  astro: `---
import { Heading } from '@var-ui/astro';
---

<Heading level={2}>Section title</Heading>`,
  html: `<h2 data-size="md" class="var-ui-heading">Section title</h2>`,
} satisfies DemoSnippets;
