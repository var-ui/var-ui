import { MoreMenu } from '@var-ui/react';

export default function Preview() {
  return (
    <MoreMenu
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
