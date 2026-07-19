'use client';

import { RadioGroup } from '@var-ui/react';

export function RadioGroupDemo() {
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
