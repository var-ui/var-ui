import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Table } from '@var-ui/react';

<Table
  isStriped
  density="compact"
  caption="Team roster"
  columns={[
    { key: 'name', header: 'Name', isRowHeader: true },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ]}
  data={[
    { name: 'Ada', role: 'Admin', status: 'Active' },
    { name: 'Grace', role: 'Editor', status: 'Active' },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
