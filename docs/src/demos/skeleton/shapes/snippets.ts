import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Skeleton } from '@var-ui/react';

<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <Skeleton shape="circle" style={{ width: 40, height: 40 }} />
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Skeleton shape="text" style={{ width: 140, height: 14 }} />
    <Skeleton shape="rect" style={{ width: 200, height: 48 }} />
  </div>
</div>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
