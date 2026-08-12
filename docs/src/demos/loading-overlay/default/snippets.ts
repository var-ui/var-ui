import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { LoadingOverlay } from '@var-ui/react';

<LoadingOverlay visible label="Loading">
  <div style={{ width: 200, height: 80 }}>Content</div>
</LoadingOverlay>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
