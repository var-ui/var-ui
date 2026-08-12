import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Outline } from '@var-ui/react';

<Outline
  activeId="examples"
  scrollSpy={false}
  items={[
    { id: 'intro', text: 'Intro', level: 2 },
    { id: 'examples', text: 'Examples', level: 2 },
    { id: 'default', text: 'Default', level: 3 },
    { id: 'nested', text: 'Nested', level: 3 },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
