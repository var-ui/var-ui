import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { AppShell, SideNav, TopNav } from '@var-ui/react';

<AppShell
  topNav={<TopNav>…</TopNav>}
  sideNav={<SideNav>…</SideNav>}
>
  Main content
</AppShell>`,
  astro: `---
import { AppShell, SideNav, TopNav } from '@var-ui/astro';
---
<AppShell>
  <TopNav slot="topNav">…</TopNav>
  <SideNav slot="sideNav">…</SideNav>
  Main content
</AppShell>`,
  html: `<div data-var-ui-app-shell class="var-ui-app-shell">…</div>`,
} satisfies DemoSnippets;
