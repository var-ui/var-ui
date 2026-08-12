import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { HoverCard, Link, Text } from '@var-ui/react';

<HoverCard trigger={<Link href="/u/ada">@ada</Link>} title="Ada Lovelace">
  <Text size="sm" tone="secondary">
    Mathematician and early computing pioneer.
  </Text>
  <Link href="/u/ada">View profile</Link>
</HoverCard>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
