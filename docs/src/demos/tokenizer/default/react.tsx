import { Tokenizer } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
];

export default function Preview() {
  const [value, setValue] = useState([options[0]!]);
  return <Tokenizer label="Tags" options={options} value={value} onChange={setValue} />;
}
