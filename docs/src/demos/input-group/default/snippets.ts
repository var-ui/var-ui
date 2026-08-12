import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { InputGroup, InputGroupInput, InputGroupText } from '@var-ui/react';

<InputGroup label="Price">
  <InputGroupText>$</InputGroupText>
  <InputGroupInput aria-label="Price" />
</InputGroup>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
