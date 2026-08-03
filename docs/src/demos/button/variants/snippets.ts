import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, HStack, VStack } from '@var-ui/react';

<VStack gap="md">
  <HStack gap="sm" wrap>
    <Button tone="accent" appearance="filled">Filled</Button>
    <Button tone="accent" appearance="outline">Outline</Button>
    <Button tone="accent" appearance="subtle">Subtle</Button>
    <Button tone="accent" appearance="ghost">Ghost</Button>
  </HStack>
  <HStack gap="sm" wrap>
    <Button tone="accent" appearance="filled">Accent</Button>
    <Button tone="success" appearance="filled">Success</Button>
    <Button tone="warning" appearance="filled">Warning</Button>
    <Button tone="danger" appearance="filled">Danger</Button>
    <Button tone="info" appearance="filled">Info</Button>
  </HStack>
</VStack>`,
  astro: `---
import { Button, HStack, VStack } from '@var-ui/astro';
---

<VStack gap="md">
  <HStack gap="sm" wrap>
    <Button tone="accent" appearance="filled">Filled</Button>
    <Button tone="accent" appearance="outline">Outline</Button>
    <Button tone="accent" appearance="subtle">Subtle</Button>
    <Button tone="accent" appearance="ghost">Ghost</Button>
  </HStack>
  <HStack gap="sm" wrap>
    <Button tone="accent" appearance="filled">Accent</Button>
    <Button tone="success" appearance="filled">Success</Button>
    <Button tone="warning" appearance="filled">Warning</Button>
    <Button tone="danger" appearance="filled">Danger</Button>
    <Button tone="info" appearance="filled">Info</Button>
  </HStack>
</VStack>`,
  html: `<div class="var-ui-stack" data-direction="column" data-gap="md" data-align="stretch" data-justify="start" data-wrap="nowrap">
  <div class="var-ui-stack" data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="wrap">
    <button type="button" class="var-ui-button" data-tone="accent" data-appearance="filled" data-size="md" data-layout="default">Filled</button>
    <button type="button" class="var-ui-button" data-tone="accent" data-appearance="outline" data-size="md" data-layout="default">Outline</button>
    <button type="button" class="var-ui-button" data-tone="accent" data-appearance="subtle" data-size="md" data-layout="default">Subtle</button>
    <button type="button" class="var-ui-button" data-tone="accent" data-appearance="ghost" data-size="md" data-layout="default">Ghost</button>
  </div>
  <div class="var-ui-stack" data-direction="row" data-gap="sm" data-align="center" data-justify="start" data-wrap="wrap">
    <button type="button" class="var-ui-button" data-tone="accent" data-appearance="filled" data-size="md" data-layout="default">Accent</button>
    <button type="button" class="var-ui-button" data-tone="success" data-appearance="filled" data-size="md" data-layout="default">Success</button>
    <button type="button" class="var-ui-button" data-tone="warning" data-appearance="filled" data-size="md" data-layout="default">Warning</button>
    <button type="button" class="var-ui-button" data-tone="danger" data-appearance="filled" data-size="md" data-layout="default">Danger</button>
    <button type="button" class="var-ui-button" data-tone="info" data-appearance="filled" data-size="md" data-layout="default">Info</button>
  </div>
</div>`,
} satisfies DemoSnippets;
