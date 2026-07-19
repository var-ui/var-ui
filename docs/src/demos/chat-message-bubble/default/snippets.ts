import type { DemoSnippets } from '../../types';
import { render } from './html';

export const snippets = {
  react: `import { ChatMessage, ChatMessageBubble } from '@var-ui/react';

<ChatMessage sender="assistant" name="Navi">
  <ChatMessageBubble group="first">First part of a multi-part reply.</ChatMessageBubble>
  <ChatMessageBubble group="last">Second part.</ChatMessageBubble>
</ChatMessage>`,
  astro: `---
// No @var-ui/astro ChatMessageBubble — core recipe with group corners.
import { chatMessage, chatMessageBubble } from '@var-ui/core';

const m = chatMessage({ sender: 'assistant' });
const first = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'first' });
const last = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'last' });
---

<div class:list={[m.root]}>
  <div class:list={[m.content]}>
    <div class:list={[m.header]}><span class:list={[m.name]}>Navi</span></div>
    <div class:list={[first.root]}>First part of a multi-part reply.</div>
    <div class:list={[last.root]}>Second part.</div>
  </div>
</div>`,
  html: render(),
} satisfies DemoSnippets;
