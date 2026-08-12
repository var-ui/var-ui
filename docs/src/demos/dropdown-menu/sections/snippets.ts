import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Button, DropdownMenu } from '@var-ui/react';

<DropdownMenu
  trigger={<Button intent="secondary">File</Button>}
  sections={[
    {
      label: 'Edit',
      items: [
        { id: 'cut', label: 'Cut', shortcut: '⌘X' },
        { id: 'copy', label: 'Copy', shortcut: '⌘C' },
        { id: 'paste', label: 'Paste', shortcut: '⌘V' },
      ],
    },
    {
      label: 'Danger zone',
      items: [
        { id: 'archive', label: 'Archive' },
        { id: 'delete', label: 'Delete…', danger: true },
      ],
    },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
