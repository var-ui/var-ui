import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Thumbnail } from '@var-ui/react';

const previewUrl = '…';

<Thumbnail src={previewUrl} alt="Preview image" />`,
  astro: `---
// No @var-ui/astro Thumbnail — use core recipe markup.
import { thumbnail } from '@var-ui/core';

const s = thumbnail({ size: 'md' });
const previewUrl = '…';
---

<span class:list={[s.root]}>
  <img class:list={[s.image]} src={previewUrl} alt="Preview image" />
</span>`,
  html: `<span data-size="md" class="var-ui-thumbnail"><img data-size="md" class="var-ui-thumbnail__image" src="…" alt="Preview image" /></span>`,
} satisfies DemoSnippets;
