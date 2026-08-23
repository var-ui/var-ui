import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, SimpleTooltip } from '@var-ui/react';

<SimpleTooltip content="Save changes">
  <Button>Save</Button>
</SimpleTooltip>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
