import { Button, Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu.FromSections
      trigger={<Button intent="secondary">Actions</Button>}
      sections={[
        {
          items: [
            { id: 'edit', label: 'Edit' },
            { id: 'duplicate', label: 'Duplicate' },
          ],
        },
      ]}
    />
  );
}
