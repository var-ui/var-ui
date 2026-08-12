import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ScrollArea } from '@var-ui/react';

<ScrollArea fade="vertical" style={{ height: 120, width: 240 }}>
  <p>Long content…</p>
</ScrollArea>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
