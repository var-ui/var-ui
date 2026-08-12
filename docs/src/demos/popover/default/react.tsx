import { Button, Popover } from '@var-ui/react';

export default function Preview() {
  return (
    <Popover trigger={<Button intent="secondary">Open</Button>} title="Details">
      <p>Popover body content.</p>
    </Popover>
  );
}
