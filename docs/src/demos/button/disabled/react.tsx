import { Button, HStack } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="sm" wrap>
      <Button isDisabled>Disabled</Button>
      <Button intent="primary" isDisabled>
        Disabled primary
      </Button>
    </HStack>
  );
}
