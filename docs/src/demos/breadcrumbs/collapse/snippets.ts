import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Breadcrumbs } from '@var-ui/react';

<Breadcrumbs
  maxItems={3}
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'hardware', label: 'Hardware', href: '/products/hardware' },
    { id: 'laptops', label: 'Laptops', href: '/products/hardware/laptops' },
    { id: 'current', label: 'Pro 16' },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
