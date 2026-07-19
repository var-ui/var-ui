import type { DemoSnippets } from '../../types';
import { render } from './html';

export const snippets = {
  react: `import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@var-ui/react';

<ChatMessageList>
  <ChatMessage sender="assistant">
    <ChatMessageBubble>Hello! How can I help?</ChatMessageBubble>
  </ChatMessage>
  <ChatMessage sender="user">
    <ChatMessageBubble>What components ship in var-ui?</ChatMessageBubble>
  </ChatMessage>
</ChatMessageList>`,
  astro: `---
// No @var-ui/astro ChatMessageList — core recipe log region.
import { chatMessage, chatMessageBubble, chatMessageList } from '@var-ui/core';

const l = chatMessageList({ density: 'balanced' });
const assistant = chatMessage({ sender: 'assistant' });
const user = chatMessage({ sender: 'user' });
const assistantBubble = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'none' });
const userBubble = chatMessageBubble({ sender: 'user', variant: 'filled', group: 'none' });
---

<div class:list={[l.root]} role="log" aria-live="polite">
  <div class:list={[l.inner]}>
    <div class:list={[assistant.root]}>
      <div class:list={[assistant.content]}>
        <div class:list={[assistantBubble.root]}>Hello! How can I help?</div>
      </div>
    </div>
    <div class:list={[user.root]}>
      <div class:list={[user.content]}>
        <div class:list={[userBubble.root]}>What components ship in var-ui?</div>
      </div>
    </div>
  </div>
</div>`,
  html: render(),
} satisfies DemoSnippets;
