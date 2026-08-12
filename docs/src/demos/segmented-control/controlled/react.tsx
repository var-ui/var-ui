import { SegmentedControl } from '@var-ui/react';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';

export default function Preview() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['list']));

  return (
    <SegmentedControl
      selectionMode="single"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      options={[
        { id: 'list', label: 'List' },
        { id: 'grid', label: 'Grid' },
        { id: 'board', label: 'Board' },
      ]}
    />
  );
}
