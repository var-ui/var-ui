import { Button, SimpleTooltip } from '@var-ui/react';

export default function Preview() {
  return (
    <SimpleTooltip content="Save changes">
      <Button>Save</Button>
    </SimpleTooltip>
  );
}
