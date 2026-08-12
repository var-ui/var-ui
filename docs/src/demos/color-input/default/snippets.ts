import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ColorInput } from '@var-ui/react';

<ColorInput label="Brand" defaultValue="#6366f1" />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
