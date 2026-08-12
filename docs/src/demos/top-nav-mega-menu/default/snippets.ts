import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { TopNav } from '@var-ui/react';

<TopNav>
  <TopNav.MegaMenu
    label="Solutions"
    items={[{ id: 'startups', title: 'For startups', href: '/startups' }]}
    featured={<TopNav.MegaMenu.FeaturedCard title="Enterprise" description="Scale" />}
  />
</TopNav>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
