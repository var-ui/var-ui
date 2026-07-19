import type { DemoSnippets } from '../../types';
import { render } from './html';

export const snippets = {
  react: `import { useState } from 'react';
import { ChatComposer, ChatComposerInput, ChatSendButton } from '@var-ui/react';

function Composer() {
  const [value, setValue] = useState('');
  return (
    <ChatComposer actions={<ChatSendButton onPress={() => setValue('')} />}>
      <ChatComposerInput
        value={value}
        onChange={setValue}
        onSubmit={() => setValue('')}
        placeholder="Type a message…"
      />
    </ChatComposer>
  );
}`,
  astro: `---
// No @var-ui/astro ChatComposer — static core-recipe chrome (non-interactive).
import { button, chatComposer } from '@var-ui/core';

const c = chatComposer();
const send = button({ intent: 'primary' });
---

<div class:list={[c.root]}>
  <div class:list={[c.inputRow]}>
    <textarea class:list={[c.input]} rows="1" placeholder="Type a message…" disabled></textarea>
  </div>
  <div class:list={[c.actions]}>
    <button type="button" class:list={[send]} aria-label="Send message" disabled>↑</button>
  </div>
</div>`,
  html: render(),
} satisfies DemoSnippets;
