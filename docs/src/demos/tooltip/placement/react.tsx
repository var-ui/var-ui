import { Button, HStack, Tooltip } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="md" wrap>
      <Tooltip content="Below the trigger" placement="bottom" delay={200}>
        <Button intent="secondary">Bottom · 200ms</Button>
      </Tooltip>
      <Tooltip content="After the trigger" placement="end">
        <Button intent="secondary">End</Button>
      </Tooltip>
    </HStack>
  );
}
