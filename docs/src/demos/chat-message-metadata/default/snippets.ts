import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ChatMessageMetadata } from '@var-ui/react';

<ChatMessageMetadata date={new Date()} format="time" status="Read" />`,
  astro: `---
// No @var-ui/astro ChatMessageMetadata — Timestamp + status via core recipes.
import { stack, textBlock } from '@var-ui/core';

const row = stack({ direction: 'row', gap: 'xs', align: 'center', justify: 'start', wrap: 'nowrap' });
const time = textBlock({ size: 'sm', tone: 'secondary' });
---

<div class:list={[row]}>
  <time class:list={[time]} datetime="2026-07-19T21:35:00.000Z">2:35 PM</time>
  Read
</div>`,
  html: `<div data-direction="row" data-gap="xs" data-align="center" data-justify="start" data-wrap="nowrap" class="var-ui-stack"><time data-size="sm" data-tone="secondary" data-weight="normal" data-line-clamp="false" class="var-ui-text-block" datetime="2026-07-19T21:35:00.000Z" title="Jul 19, 2026, 2:35 PM">2:35 PM</time>Read</div>`,
} satisfies DemoSnippets;
