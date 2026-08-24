import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Hidden, Text } from '@var-ui/react';

<Hidden hide={{ md: true }} as="aside">
  <Text>Visible below md</Text>
</Hidden>`,
  astro: `---
import { Hidden, Text } from '@var-ui/astro';
---
<Hidden hide={{ md: true }} as="aside">
  <Text>Visible below md</Text>
</Hidden>`,
  html: `<aside class="var-ui-hidden-base-false var-ui-hidden-md-true">
  <p class="var-ui-text-block">Visible below md</p>
</aside>`,
} satisfies DemoSnippets;
