import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Toolbar } from '@var-ui/react';

<Toolbar
  label="Document actions"
  startContent={<Button>Bold</Button>}
  endContent={<Button>Share</Button>}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
