import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { PasswordInput } from '@var-ui/react';

<PasswordInput
  label="Password"
  description="Use at least 8 characters"
  errorMessage="Password is too short"
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
