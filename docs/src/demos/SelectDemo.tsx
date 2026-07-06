'use client';

import { Select } from '@var-ui/react';

export function SelectDemo() {
  return (
    <Select
      label="Fruit"
      options={[
        { id: 'apple', label: 'Apple' },
        { id: 'plum', label: 'Plum' },
      ]}
    />
  );
}
