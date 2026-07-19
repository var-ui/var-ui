import { Button, HStack } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="sm" wrap>
      <Button intent="primary">Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="ghost">Ghost</Button>
    </HStack>
  );
}
