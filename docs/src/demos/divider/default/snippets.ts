import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Divider, Text } from '@var-ui/react';

<>
  <Text>Above</Text>
  <Divider />
  <Text>Below</Text>
</>`,
  astro: `---
import { Divider, Text } from '@var-ui/astro';
---

<Text>Above</Text>
<Divider />
<Text>Below</Text>`,
  html: `<p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">Above</p>
<hr data-orientation="horizontal" class="var-ui-divider"></hr>
<p data-size="md" data-tone="primary" data-weight="normal" class="var-ui-text-block">Below</p>`,
} satisfies DemoSnippets;
