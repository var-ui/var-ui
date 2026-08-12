import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { DescriptionList } from '@var-ui/react';

<DescriptionList title="Details">
  <DescriptionList.Item label="Owner">Ada</DescriptionList.Item>
  <DescriptionList.Item label="Status">Active</DescriptionList.Item>
</DescriptionList>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
