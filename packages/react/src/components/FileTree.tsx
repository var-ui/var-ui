import type { JSX, ReactNode } from 'react';
import { fileTree } from '@var-ui/core';
import { recipeProps } from './utils';

export type FileTreeProps = {
  children: ReactNode;
  className?: string;
};

function FileTreeRoot({ children, className }: FileTreeProps): JSX.Element {
  const t = fileTree();
  return (
    <div {...recipeProps(t.root, className)}>
      <ul {...recipeProps(t.list)}>{children}</ul>
    </div>
  );
}

export type FileTreeFolderProps = {
  name: string;
  children?: ReactNode;
  className?: string;
};

function FileTreeFolder({ name, children, className }: FileTreeFolderProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...recipeProps(t.item, className)}>
      <span {...recipeProps(t.row)}>
        <span {...recipeProps(t.folder)}>{name}</span>
      </span>
      {children != null ? <ul {...recipeProps(t.listNested)}>{children}</ul> : null}
    </li>
  );
}

export type FileTreeFileProps = {
  name: string;
  className?: string;
};

function FileTreeFile({ name, className }: FileTreeFileProps): JSX.Element {
  const t = fileTree();
  return (
    <li {...recipeProps(t.item, className)}>
      <span {...recipeProps(t.row)}>
        <span {...recipeProps(t.file)}>{name}</span>
      </span>
    </li>
  );
}

export const FileTree = Object.assign(FileTreeRoot, {
  Folder: FileTreeFolder,
  File: FileTreeFile,
});
