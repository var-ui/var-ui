import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { FileTree } from '@var-ui/react';

<FileTree>
  <FileTree.Folder name="src">
    <FileTree.File name="index.ts" />
  </FileTree.Folder>
</FileTree>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
