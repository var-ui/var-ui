import { Button, HStack } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="sm" wrap>
      <Button isDisabled>Disabled</Button>
      <Button tone="accent" appearance="filled" isDisabled>
        Disabled primary
      </Button>
    </HStack>
  );
}
