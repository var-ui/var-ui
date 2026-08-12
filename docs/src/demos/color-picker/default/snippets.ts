import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ColorPicker, ColorSwatch } from '@var-ui/react';

<ColorPicker value={color} onChange={setColor} />
<ColorSwatch color="#228be6" selected aria-label="Blue" />`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
