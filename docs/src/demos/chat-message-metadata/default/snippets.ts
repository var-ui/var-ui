import type { DemoSnippets } from '../../types';
import { render } from './html';

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
  html: render(),
} satisfies DemoSnippets;
