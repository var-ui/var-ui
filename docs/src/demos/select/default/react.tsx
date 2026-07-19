import { Select } from '@var-ui/react';

export default function Preview() {
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
