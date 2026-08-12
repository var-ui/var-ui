import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SimpleGrid } from '@var-ui/react';

<SimpleGrid cols={3} spacing="sm">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
</SimpleGrid>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
