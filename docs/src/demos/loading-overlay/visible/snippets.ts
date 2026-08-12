import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { LoadingOverlay } from '@var-ui/react';

<LoadingOverlay visible label="Saving changes">
  <div style={{ width: 280, minHeight: 120, padding: 16 }}>
    <strong>Account settings</strong>
    <p>Display name, email, and notification preferences.</p>
  </div>
</LoadingOverlay>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
