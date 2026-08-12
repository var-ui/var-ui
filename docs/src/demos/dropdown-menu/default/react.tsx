import { Button, DropdownMenu } from '@var-ui/react';

export default function Preview() {
  return (
    <DropdownMenu
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
