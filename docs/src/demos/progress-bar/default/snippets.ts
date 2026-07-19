import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ProgressBar } from '@var-ui/react';

<ProgressBar label="Uploading assets" value={64} />`,
  astro: `---
import { ProgressBar } from '@var-ui/astro';
---

<ProgressBar label="Uploading assets" value={64} />`,
  html: `<div data-tone="accent" class="var-ui-progress-bar" role="progressbar" aria-label="Uploading assets" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64"><div data-tone="accent" class="var-ui-progress-bar__header"><span data-tone="accent" class="var-ui-progress-bar__label">Uploading assets</span><span data-tone="accent" class="var-ui-progress-bar__valueText">64%</span></div><div data-tone="accent" class="var-ui-progress-bar__track"><div data-tone="accent" class="var-ui-progress-bar__fill" style="width: 64%"></div></div></div>`,
} satisfies DemoSnippets;
