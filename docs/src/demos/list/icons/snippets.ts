import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Icon, List } from '@var-ui/react';

<List header="Shortcuts" hasDividers>
  <List.Item
    label="Search"
    description="Find anything"
    startContent={<Icon name="search" size="sm" />}
  />
  <List.Item
    label="Recent"
    description="Opened today"
    startContent={<Icon name="clock" size="sm" />}
  />
</List>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
