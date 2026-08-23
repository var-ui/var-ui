import { Button, HStack, SimpleTooltip } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="md" wrap>
      <SimpleTooltip content="Below the trigger" placement="bottom" delay={200}>
        <Button intent="secondary">Bottom · 200ms</Button>
      </SimpleTooltip>
      <SimpleTooltip content="After the trigger" placement="end">
        <Button intent="secondary">End</Button>
      </SimpleTooltip>
    </HStack>
  );
}
