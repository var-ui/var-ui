import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Breadcrumbs } from '@var-ui/react';

<Breadcrumbs
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'docs', label: 'Docs', href: '/docs' },
    { id: 'current', label: 'Breadcrumbs' },
  ]}
/>`,
  astro: `---
import { Breadcrumbs } from '@var-ui/astro';
---
<Breadcrumbs
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'docs', label: 'Docs', href: '/docs' },
    { id: 'current', label: 'Breadcrumbs' },
  ]}
/>`,
  html: `<nav class="var-ui-breadcrumbs" aria-label="Breadcrumb">…</nav>`,
} satisfies DemoSnippets;
