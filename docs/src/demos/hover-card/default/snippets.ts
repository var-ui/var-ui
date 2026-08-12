import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HoverCard, Link } from '@var-ui/react';

<HoverCard trigger={<Link href="/u/ada">Ada Lovelace</Link>} title="Ada Lovelace">
  <p>Mathematician and early computing pioneer.</p>
</HoverCard>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
