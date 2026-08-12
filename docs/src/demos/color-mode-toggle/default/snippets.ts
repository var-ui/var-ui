import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ColorModeToggle } from '@var-ui/react';

<ColorModeToggle colorMode={mode} onColorModeChange={setMode} />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
