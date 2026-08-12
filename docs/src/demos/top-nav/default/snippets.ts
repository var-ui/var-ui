import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TopNav } from '@var-ui/react';

<TopNav>
  <TopNav.Item label="Home" href="/" isSelected />
  <TopNav.Item label="Docs" href="/docs" />
</TopNav>`,
  astro: `---
import { TopNav, TopNavItem } from '@var-ui/astro';
---
<TopNav>
  <TopNavItem label="Home" href="/" isSelected />
  <TopNavItem label="Docs" href="/docs" />
</TopNav>`,
  html: `<nav class="var-ui-top-nav" aria-label="Top navigation">…</nav>`,
} satisfies DemoSnippets;
