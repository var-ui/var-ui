import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { SegmentedControl } from '@var-ui/react';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';

const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['list']));

<SegmentedControl
  selectionMode="single"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
  options={[
    { id: 'list', label: 'List' },
    { id: 'grid', label: 'Grid' },
    { id: 'board', label: 'Board' },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
