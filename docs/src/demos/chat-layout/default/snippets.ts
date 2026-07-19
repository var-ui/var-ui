import type { DemoSnippets } from '../../types';
import { render } from './html';

export const snippets = {
  react: `import { useState } from 'react';
import {
  Avatar,
  ChatComposer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatSendButton,
} from '@var-ui/react';

function ChatShell() {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState(['Hello! How can I help?']);

  function send(text: string) {
    setMessages((prev) => [...prev, text]);
    setValue('');
  }

  return (
    <ChatLayout
      composer={
        <ChatComposer actions={<ChatSendButton onPress={() => send(value)} />}>
          <ChatComposerInput value={value} onChange={setValue} onSubmit={send} />
        </ChatComposer>
      }
    >
      <ChatMessageList>
        {messages.map((text, index) => (
          <ChatMessage
            key={\`\${text}-\${index}\`}
            sender={index % 2 === 0 ? 'assistant' : 'user'}
            name={index % 2 === 0 ? 'Assistant' : 'You'}
            avatar={<Avatar name={index % 2 === 0 ? 'Assistant' : 'You'} size="sm" />}
          >
            <ChatMessageBubble>{text}</ChatMessageBubble>
          </ChatMessage>
        ))}
      </ChatMessageList>
    </ChatLayout>
  );
}`,
  astro: `---
// No @var-ui/astro ChatLayout — static core-recipe shell.
// Scroll-to-bottom / composer submit behavior is React-only.
import {
  avatar,
  button,
  chatComposer,
  chatLayout,
  chatMessage,
  chatMessageBubble,
  chatMessageList,
} from '@var-ui/core';

const l = chatLayout();
const list = chatMessageList({ density: 'balanced' });
const m = chatMessage({ sender: 'assistant' });
const bubble = chatMessageBubble({ sender: 'assistant', variant: 'filled', group: 'none' });
const a = avatar({ size: 'sm' });
const c = chatComposer();
const send = button({ intent: 'primary' });
---

<div style="height: 280px">
  <div class:list={[l.root]}>
    <div class:list={[l.messageArea]}>
      <div class:list={[list.root]} role="log" aria-live="polite">
        <div class:list={[list.inner]}>
          <div class:list={[m.root]}>
            <div class:list={[m.avatar]}>
              <span class:list={[a.root]}>
                <span class:list={[a.initials]} role="img" aria-label="Assistant">A</span>
              </span>
            </div>
            <div class:list={[m.content]}>
              <div class:list={[m.header]}><span class:list={[m.name]}>Assistant</span></div>
              <div class:list={[bubble.root]}>Hello! How can I help?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class:list={[l.dock]}>
      <div class:list={[c.root]}>
        <div class:list={[c.inputRow]}>
          <textarea class:list={[c.input]} rows="1" placeholder="Type a message…" disabled></textarea>
        </div>
        <div class:list={[c.actions]}>
          <button type="button" class:list={[send]} aria-label="Send message" disabled>↑</button>
        </div>
      </div>
    </div>
  </div>
</div>`,
  html: render(),
} satisfies DemoSnippets;
