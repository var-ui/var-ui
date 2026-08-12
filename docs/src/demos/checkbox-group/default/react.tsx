import { CheckboxGroup } from '@var-ui/react';

export default function Preview() {
  return (
    <CheckboxGroup
      label="Features"
      options={[
        { value: 'analytics', label: 'Analytics' },
        { value: 'billing', label: 'Billing' },
      ]}
    />
  );
}
