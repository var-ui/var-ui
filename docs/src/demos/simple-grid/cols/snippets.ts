import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SimpleGrid } from '@var-ui/react';

<SimpleGrid cols={4} spacing="md">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div>Four</div>
</SimpleGrid>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
