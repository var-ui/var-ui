import { FileTree } from '@var-ui/react';

export default function Preview() {
  return (
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
      <FileTree.Folder name="docs">
        <FileTree.File name="README.md" />
      </FileTree.Folder>
      <FileTree.File name="pnpm-workspace.yaml" />
    </FileTree>
  );
}
