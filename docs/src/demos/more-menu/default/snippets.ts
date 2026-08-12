import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { MoreMenu } from '@var-ui/react';

<MoreMenu sections={[{ items: [{ id: 'edit', label: 'Edit' }] }]} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
