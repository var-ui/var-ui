import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Steps } from '@var-ui/react';

<Steps>
  <li>Install package</li>
  <li>Import styles</li>
  <li>Render components</li>
</Steps>`,
  astro: `---
import { Steps } from '@var-ui/astro';
---
<Steps>
  <li>Install package</li>
  <li>Import styles</li>
  <li>Render components</li>
</Steps>`,
  html: `<ol class="var-ui-steps">
  <li>Install package</li>
  <li>Import styles</li>
  <li>Render components</li>
</ol>`,
} satisfies DemoSnippets;
