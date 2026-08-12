import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Tokenizer } from '@var-ui/react';

<Tokenizer label="Tags" options={options} value={value} onChange={setValue} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
