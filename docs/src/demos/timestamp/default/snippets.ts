import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Timestamp } from '@var-ui/react';

<Timestamp date={new Date(Date.now() - 5 * 60_000)} />`,
  astro: `---
// No @var-ui/astro Timestamp — format the label yourself and use textBlock styles.
import { textBlock } from '@var-ui/core';

const t = textBlock({ size: 'sm', tone: 'secondary' });
---

<time
  class:list={[t]}
  datetime="2026-07-19T21:35:00.000Z"
  title="Jul 19, 2026, 2:35 PM"
>
  5 minutes ago
</time>`,
  html: `<time data-size="sm" data-tone="secondary" data-weight="normal" class="var-ui-text-block" datetime="2026-07-19T21:35:00.000Z" title="Jul 19, 2026, 2:35 PM">5 minutes ago</time>`,
} satisfies DemoSnippets;
