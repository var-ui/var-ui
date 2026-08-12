import { MultiSelector } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { id: 'eng', label: 'Engineering' },
  { id: 'design', label: 'Design' },
  { id: 'ops', label: 'Ops' },
];

export default function Preview() {
  const [value, setValue] = useState<string[]>(['eng']);
  return <MultiSelector label="Teams" options={options} value={value} onChange={setValue} />;
}
