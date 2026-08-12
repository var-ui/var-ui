import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Toc } from '@var-ui/react';

<Toc title="On this page">
  <Toc.Item label="Examples" href="#examples" isSelected />
  <Toc.Item label="Default" href="#default" isNested />
  <Toc.Item label="Nested items" href="#nested" isNested />
  <Toc.Item label="Props" href="#props" />
  <Toc.Item label="Accessibility" href="#accessibility" />
</Toc>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
