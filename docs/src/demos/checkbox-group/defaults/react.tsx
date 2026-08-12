import { CheckboxGroup } from '@var-ui/react';

export default function Preview() {
  return (
    <CheckboxGroup
      label="Features"
      defaultValue={['analytics', 'billing']}
      options={[
        { value: 'analytics', label: 'Analytics' },
        { value: 'billing', label: 'Billing' },
        { value: 'support', label: 'Priority support' },
      ]}
    />
  );
}
