import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack } from '@var-ui/react';

<HStack gap="sm" wrap>
  <Button isDisabled>Disabled</Button>
  <Button intent="primary" isDisabled>
    Disabled primary
  </Button>
</HStack>`,
  astro: `---
import { Button, HStack } from '@var-ui/astro';
---

<HStack gap="sm" wrap>
  <Button disabled>Disabled</Button>
  <Button intent="primary" disabled>Disabled primary</Button>
</HStack>`,
  html: `<div class="var-ui-stack" data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="wrap">
  <button type="button" class="var-ui-button" data-intent="secondary" data-size="md" data-layout="default" disabled>Disabled</button>
  <button type="button" class="var-ui-button" data-intent="primary" data-size="md" data-layout="default" disabled>Disabled primary</button>
</div>`,
} satisfies DemoSnippets;
