import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Menu } from '@var-ui/react';

<Menu.Overflow
  aria-label="Row actions"
  sections={[
    {
      items: [
        { id: 'share', label: 'Share' },
        { id: 'duplicate', label: 'Duplicate' },
        { id: 'archive', label: 'Archive' },
        { id: 'delete', label: 'Delete', danger: true },
      ],
    },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
