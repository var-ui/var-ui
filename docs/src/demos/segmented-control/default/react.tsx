import { SegmentedControl } from '@var-ui/react';

export default function Preview() {
  return (
    <SegmentedControl
      selectionMode="single"
      defaultSelectedKeys={['list']}
      options={[
        { id: 'list', label: 'List' },
        { id: 'grid', label: 'Grid' },
      ]}
    />
  );
}
