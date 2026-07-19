import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Text } from '@var-ui/react';

<Text tone="secondary">Body text with secondary tone.</Text>`,
  astro: `---
import { Text } from '@var-ui/astro';
---

<Text tone="secondary">Body text with secondary tone.</Text>`,
  html: `<p data-size="md" data-tone="secondary" data-weight="normal" class="var-ui-text-block">Body text with secondary tone.</p>`,
} satisfies DemoSnippets;
