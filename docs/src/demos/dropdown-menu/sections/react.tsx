import { Button, DropdownMenu } from '@var-ui/react';

export default function Preview() {
  return (
    <DropdownMenu
      trigger={<Button intent="secondary">File</Button>}
      sections={[
        {
          label: 'Edit',
          items: [
            { id: 'cut', label: 'Cut', shortcut: '⌘X' },
            { id: 'copy', label: 'Copy', shortcut: '⌘C' },
            { id: 'paste', label: 'Paste', shortcut: '⌘V' },
          ],
        },
        {
          label: 'Danger zone',
          items: [
            { id: 'archive', label: 'Archive' },
            { id: 'delete', label: 'Delete…', danger: true },
          ],
        },
      ]}
    />
  );
}
