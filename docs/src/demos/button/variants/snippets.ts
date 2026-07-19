import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack } from '@var-ui/react';

<HStack gap="sm" wrap>
  <Button intent="primary">Primary</Button>
  <Button intent="secondary">Secondary</Button>
  <Button intent="ghost">Ghost</Button>
</HStack>`,
  astro: `---
import { Button, HStack } from '@var-ui/astro';
---

<HStack gap="sm" wrap>
  <Button intent="primary">Primary</Button>
  <Button intent="secondary">Secondary</Button>
  <Button intent="ghost">Ghost</Button>
</HStack>`,
  html: `<div class="var-ui-stack" data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="wrap">
  <button type="button" class="var-ui-button" data-intent="primary" data-size="md" data-layout="default">Primary</button>
  <button type="button" class="var-ui-button" data-intent="secondary" data-size="md" data-layout="default">Secondary</button>
  <button type="button" class="var-ui-button" data-intent="ghost" data-size="md" data-layout="default">Ghost</button>
</div>`,
} satisfies DemoSnippets;
