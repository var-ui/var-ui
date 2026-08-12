import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { List } from '@var-ui/react';

<List header="Members">
  <List.Item label="Ada Lovelace" description="Admin" />
  <List.Item label="Grace Hopper" description="Editor" />
</List>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
