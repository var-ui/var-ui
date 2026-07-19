import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { FileTree } from './FileTree';

describe('FileTree', () => {
  it('renders folder and file labels', () => {
    render(
      <FileTree>
        <FileTree.Folder name="src">
          <FileTree.File name="index.ts" />
        </FileTree.Folder>
      </FileTree>,
    );
    expect(screen.getByText('src')).toBeTruthy();
    expect(screen.getByText('index.ts')).toBeTruthy();
  });
});
