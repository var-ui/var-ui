import { RadioGroup } from '@var-ui/react';

export default function Preview() {
  return (
    <RadioGroup
      label="Plan"
      options={[
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
      ]}
    />
  );
}
