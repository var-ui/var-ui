import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Tokenizer } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
  { id: 'delta', label: 'Delta' },
];

const [value, setValue] = useState([options[0], options[2]]);

<Tokenizer
  label="Tags"
  description="Start with a few tokens already selected"
  options={options}
  value={value}
  onChange={setValue}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
