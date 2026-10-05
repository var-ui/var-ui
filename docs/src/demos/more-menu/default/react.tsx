import { Menu } from '@var-ui/react';

export default function Preview() {
  return (
    <Menu.Overflow
      sections={[
        {
          items: [
            { id: 'edit', label: 'Edit' },
            { id: 'delete', label: 'Delete', danger: true },
          ],
        },
      ]}
    />
  );
}
