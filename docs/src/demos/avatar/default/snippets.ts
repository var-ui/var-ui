import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Avatar } from '@var-ui/react';

<Avatar name="Ada Lovelace" status="success" />`,
  astro: `---
import { Avatar } from '@var-ui/astro';
---

<Avatar name="Ada Lovelace" status="success" />`,
  html: `<span data-size="md" class="var-ui-avatar"><span data-size="md" class="var-ui-avatar__initials" role="img" aria-label="Ada Lovelace">AL</span><span data-size="md" class="var-ui-avatar__status" data-avatar-status><span data-tone="success" class="var-ui-status-dot"></span></span></span>`,
} satisfies DemoSnippets;
