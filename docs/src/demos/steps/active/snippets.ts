import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Steps } from '@var-ui/react';

<Steps>
  <li>Choose a plan</li>
  <li aria-current="step">Enter billing details</li>
  <li>Confirm purchase</li>
</Steps>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
