import { Tokenizer } from '@var-ui/react';
import { useState } from 'react';

const options = [
  { id: 'alpha', label: 'Alpha' },
  { id: 'beta', label: 'Beta' },
  { id: 'gamma', label: 'Gamma' },
  { id: 'delta', label: 'Delta' },
];

export default function Preview() {
  const [value, setValue] = useState([options[0]!, options[2]!]);

  return (
    <Tokenizer
      label="Tags"
      description="Start with a few tokens already selected"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
