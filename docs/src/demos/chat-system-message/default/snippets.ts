import type { DemoSnippets } from '../../types';
import { render } from './html';

export const snippets = {
  react: `import { ChatSystemMessage } from '@var-ui/react';

<>
  <ChatSystemMessage tone="info">Model switched to GPT-5</ChatSystemMessage>
  <ChatSystemMessage tone="success">Alex joined the conversation</ChatSystemMessage>
</>`,
  astro: `---
// No @var-ui/astro ChatSystemMessage — core recipe markup.
import { chatSystemMessage } from '@var-ui/core';

const info = chatSystemMessage({ tone: 'info' });
const success = chatSystemMessage({ tone: 'success' });
---

<div class:list={[info.root]} role="status">
  <span class:list={[info.text]}>Model switched to GPT-5</span>
</div>
<div class:list={[success.root]} role="status">
  <span class:list={[success.text]}>Alex joined the conversation</span>
</div>`,
  html: render(),
} satisfies DemoSnippets;
