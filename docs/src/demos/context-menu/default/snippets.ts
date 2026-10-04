import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Menu } from '@var-ui/react';

<Menu.ContextMenu sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}>
  <div>Right-click me</div>
</Menu.ContextMenu>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
