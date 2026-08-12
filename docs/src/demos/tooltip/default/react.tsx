import { Button, Tooltip } from '@var-ui/react';

export default function Preview() {
  return (
    <Tooltip content="Save changes">
      <Button>Save</Button>
    </Tooltip>
  );
}
