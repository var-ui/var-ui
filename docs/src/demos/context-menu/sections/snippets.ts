import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { ContextMenu } from '@var-ui/react';

<ContextMenu
  sections={[
    {
      label: 'Edit',
      items: [
        { id: 'rename', label: 'Rename' },
        { id: 'duplicate', label: 'Duplicate' },
      ],
    },
    {
      label: 'Clipboard',
      items: [
        { id: 'copy', label: 'Copy' },
        { id: 'paste', label: 'Paste' },
        { id: 'delete', label: 'Delete', danger: true },
      ],
    },
  ]}
>
  <div>Project card — right-click for actions</div>
</ContextMenu>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
