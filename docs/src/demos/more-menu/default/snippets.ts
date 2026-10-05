import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Menu } from '@var-ui/react';

<Menu.Overflow sections={[{ items: [{ id: 'edit', label: 'Edit' }] }]} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
