import { MoreMenu } from '@var-ui/react';

export default function Preview() {
  return (
    <MoreMenu
      aria-label="Row actions"
      sections={[
        {
          items: [
            { id: 'share', label: 'Share' },
            { id: 'duplicate', label: 'Duplicate' },
            { id: 'archive', label: 'Archive' },
            { id: 'delete', label: 'Delete', danger: true },
          ],
        },
      ]}
    />
  );
}
