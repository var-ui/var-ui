import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Hidden, Text } from '@var-ui/react';

<Hidden hide={{ base: true, md: false }} as="aside">
  <Text>Visible from md</Text>
</Hidden>`,
  astro: `---
import { Hidden, Text } from '@var-ui/astro';
---
<Hidden hide={{ base: true, md: false }} as="aside">
  <Text>Visible from md</Text>
</Hidden>`,
  html: `<aside>
  <p class="var-ui-text-block">Visible from md</p>
</aside>`,
} satisfies DemoSnippets;
