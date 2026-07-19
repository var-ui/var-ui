import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button } from '@var-ui/react';

<Button>Click me</Button>`,
  astro: `---
import { Button } from '@var-ui/astro';
---

<Button>Click me</Button>`,
  html: `<button type="button" class="var-ui-button" data-intent="secondary" data-size="md" data-layout="default">Click me</button>`,
} satisfies DemoSnippets;
