import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { DescriptionList } from '@var-ui/react';

<DescriptionList columns="multi" labelPosition="start" title="Project">
  <DescriptionList.Item label="Owner">Ada Lovelace</DescriptionList.Item>
  <DescriptionList.Item label="Status">Active</DescriptionList.Item>
  <DescriptionList.Item label="Region">us-west-2</DescriptionList.Item>
  <DescriptionList.Item label="Plan">Pro</DescriptionList.Item>
</DescriptionList>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
