import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { PasswordInput } from '@var-ui/react';

<PasswordInput label="Password" />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
