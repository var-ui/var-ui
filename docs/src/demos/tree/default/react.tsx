import { Tree } from '@var-ui/react';

export default function Preview() {
  return (
    <Tree
      aria-label="Files"
      defaultExpandedKeys={['src']}
      items={[
        {
          id: 'src',
          label: 'src',
          children: [{ id: 'app', label: 'App.tsx' }],
        },
        { id: 'readme', label: 'README.md' },
      ]}
    />
  );
}
