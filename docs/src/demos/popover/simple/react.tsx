import { Button, SimplePopover } from '@var-ui/react';

export default function Preview() {
  return (
    <SimplePopover trigger={<Button intent="secondary">Open</Button>} title="Details">
      <p>Popover body content.</p>
    </SimplePopover>
  );
}
