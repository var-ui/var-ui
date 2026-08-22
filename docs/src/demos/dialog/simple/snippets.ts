import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SimpleDialog } from '@var-ui/react';

<SimpleDialog
  triggerLabel="Open dialog"
  title="Notifications"
  description="You are all caught up."
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
