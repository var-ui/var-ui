import { ContextMenu } from '@var-ui/react';

export default function Preview() {
  return (
    <ContextMenu
      sections={[
        {
          items: [
            { id: 'copy', label: 'Copy' },
            { id: 'paste', label: 'Paste' },
          ],
        },
      ]}
    >
      <div
        style={{
          padding: 24,
          border: '1px dashed var(--var-ui-color-border-subtle)',
          borderRadius: 8,
        }}
      >
        Right-click me
      </div>
    </ContextMenu>
  );
}
