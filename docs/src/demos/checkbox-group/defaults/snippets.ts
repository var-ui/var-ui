import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { CheckboxGroup } from '@var-ui/react';

<CheckboxGroup
  label="Features"
  defaultValue={['analytics', 'billing']}
  options={[
    { value: 'analytics', label: 'Analytics' },
    { value: 'billing', label: 'Billing' },
    { value: 'support', label: 'Priority support' },
  ]}
/>`,
  astro: `<!-- No Astro binding yet — use @var-ui/react -->`,
  html: `<!-- No HTML demo yet — use @var-ui/react -->`,
} satisfies DemoSnippets;
