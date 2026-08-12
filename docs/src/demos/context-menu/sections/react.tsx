import { ContextMenu } from '@var-ui/react';

export default function Preview() {
  return (
    <ContextMenu
      sections={[
        {
          label: 'Edit',
          items: [
            { id: 'rename', label: 'Rename' },
            { id: 'duplicate', label: 'Duplicate' },
          ],
        },
        {
          label: 'Clipboard',
          items: [
            { id: 'copy', label: 'Copy' },
            { id: 'paste', label: 'Paste' },
            { id: 'delete', label: 'Delete', danger: true },
          ],
        },
      ]}
    >
      <div
        style={{
          padding: 32,
          minWidth: 220,
          border: '1px solid var(--var-ui-color-border-subtle)',
          borderRadius: 8,
          background: 'var(--var-ui-color-surface-raised)',
        }}
      >
        Project card — right-click for actions
      </div>
    </ContextMenu>
  );
}
