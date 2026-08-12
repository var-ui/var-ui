import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ToggleButton } from '@var-ui/react';

<ToggleButton>Bold</ToggleButton>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
