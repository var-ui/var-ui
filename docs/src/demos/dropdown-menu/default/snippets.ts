import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, DropdownMenu } from '@var-ui/react';

<DropdownMenu
  trigger={<Button>Actions</Button>}
  sections={[{ items: [{ id: 'edit', label: 'Edit' }] }]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
