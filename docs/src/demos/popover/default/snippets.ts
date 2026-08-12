import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, Popover } from '@var-ui/react';

<Popover trigger={<Button>Open</Button>} title="Details">
  <p>Popover body content.</p>
</Popover>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
