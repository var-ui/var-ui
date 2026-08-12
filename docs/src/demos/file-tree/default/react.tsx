import { FileTree } from '@var-ui/react';

export default function Preview() {
  return (
    <FileTree>
      <FileTree.Folder name="src">
        <FileTree.File name="index.ts" />
        <FileTree.File name="App.tsx" />
      </FileTree.Folder>
      <FileTree.File name="package.json" />
    </FileTree>
  );
}
