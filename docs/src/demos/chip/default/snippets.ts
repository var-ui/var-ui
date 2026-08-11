import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Chip, ChipGroup, Pill } from '@var-ui/react';

<ChipGroup
  selectionMode="multiple"
  selectedKeys={keys}
  onSelectionChange={setKeys}
  tone="accent"
>
  <Chip value="react">React</Chip>
  <Chip value="vue">Vue</Chip>
</ChipGroup>

<Pill onRemove={() => remove('docs')}>Documentation</Pill>`,
  astro: `---
import { Chip, Pill } from '@var-ui/astro';
---

<Chip tone="accent">Static</Chip>
<Pill tone="neutral">Documentation</Pill>`,
  html: `<span class="var-ui-chip" data-tone="accent">React</span>`,
} satisfies DemoSnippets;
