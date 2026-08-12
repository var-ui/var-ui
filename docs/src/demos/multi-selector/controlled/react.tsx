import { MultiSelector, Text, VStack } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { id: 'eng', label: 'Engineering' },
  { id: 'design', label: 'Design' },
  { id: 'ops', label: 'Ops' },
  { id: 'sales', label: 'Sales' },
];

export default function Preview() {
  const [value, setValue] = useState<string[]>(['design', 'ops']);

  return (
    <VStack gap="sm">
      <MultiSelector
        label="Teams"
        description="Selection stays in React state"
        options={options}
        value={value}
        onChange={setValue}
      />
      <Text size="sm" tone="secondary">
        Selected: {value.length ? value.join(', ') : '(none)'}
      </Text>
    </VStack>
  );
}
