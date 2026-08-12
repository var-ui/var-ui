import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { FileTree } from '@var-ui/react';

<FileTree>
  <FileTree.Folder name="packages">
    <FileTree.Folder name="react">
      <FileTree.File name="package.json" />
      <FileTree.File name="src/index.ts" />
    </FileTree.Folder>
    <FileTree.Folder name="core">
      <FileTree.File name="package.json" />
    </FileTree.Folder>
  </FileTree.Folder>
  <FileTree.File name="pnpm-workspace.yaml" />
</FileTree>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
