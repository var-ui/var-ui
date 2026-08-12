import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { OverflowList } from '@var-ui/react';

<OverflowList maxVisible={2} renderOverflow={(hidden) => <span>+{hidden.length}</span>}>
  <OverflowList.Item>Alpha</OverflowList.Item>
  <OverflowList.Item>Beta</OverflowList.Item>
  <OverflowList.Item>Gamma</OverflowList.Item>
</OverflowList>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
