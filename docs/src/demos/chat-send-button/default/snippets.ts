import type { DemoSnippets } from '../../types';
import { render } from './html';

export const snippets = {
  react: `import { useState } from 'react';
import { ChatSendButton } from '@var-ui/react';

function SendToggle() {
  const [isStreaming, setIsStreaming] = useState(false);
  return (
    <ChatSendButton
      isStreaming={isStreaming}
      onPress={() => setIsStreaming(true)}
      onStop={() => setIsStreaming(false)}
    />
  );
}`,
  astro: `---
// No @var-ui/astro ChatSendButton — static Button chrome (send state only).
// Send ↔ stop streaming toggle is React-only.
import { button } from '@var-ui/core';

const send = button({ intent: 'primary' });
---

<button type="button" class:list={[send]} aria-label="Send message">↑</button>`,
  html: render(),
} satisfies DemoSnippets;
