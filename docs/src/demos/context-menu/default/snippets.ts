import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ContextMenu } from '@var-ui/react';

<ContextMenu sections={[{ items: [{ id: 'copy', label: 'Copy' }] }]}>
  <div>Right-click me</div>
</ContextMenu>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
