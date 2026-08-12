import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { StatusDot } from '@var-ui/react';

<span>
  <StatusDot tone="success" aria-label="Online" /> Online
</span>
<span>
  <StatusDot tone="info" pulse aria-label="Syncing" /> Syncing
</span>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
