import { Button, HStack } from '@var-ui/react';

export default function Preview() {
  return (
    <HStack gap="sm">
      <Button intent="secondary">Cancel</Button>
      <Button>Save</Button>
    </HStack>
  );
}
