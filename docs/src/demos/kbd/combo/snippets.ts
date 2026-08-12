import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Kbd } from '@var-ui/react';

<span>
  Open the palette with <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>, then save with <Kbd>⌘</Kbd>
  <Kbd>S</Kbd>
</span>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
