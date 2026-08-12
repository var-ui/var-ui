import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Tooltip } from '@var-ui/react';

<Tooltip content="Below the trigger" placement="bottom" delay={200}>
  <Button intent="secondary">Bottom · 200ms</Button>
</Tooltip>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
