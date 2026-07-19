import type { DemoSnippets } from '../../types';
import { render } from './html';

export const snippets = {
  react: `import { ChatToolCalls } from '@var-ui/react';

<ChatToolCalls
  calls={[
    { name: 'read_file', status: 'complete', target: 'App.tsx', duration: '0.3s' },
    { name: 'run_tests', status: 'complete', resultDetail: <span>42 passed</span> },
  ]}
/>`,
  astro: `---
// No @var-ui/astro ChatToolCalls — static collapsed group chrome.
// Expand/collapse of 2+ calls is React-only.
import { chatToolCalls } from '@var-ui/core';

const t = chatToolCalls({ status: 'complete', expanded: 'false' });
---

<div class:list={[t.root]}>
  <button type="button" class:list={[t.header]} aria-expanded="false" disabled>
    <span class:list={[t.name]}>run_tests</span>
  </button>
</div>`,
  html: render(),
} satisfies DemoSnippets;
