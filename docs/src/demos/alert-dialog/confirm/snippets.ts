import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { AlertDialog } from '@var-ui/react';

<AlertDialog
  triggerLabel="Publish"
  title="Publish post?"
  description="Your draft will become visible to everyone with the link."
  confirmLabel="Publish"
  cancelLabel="Keep editing"
  onConfirm={() => {}}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
