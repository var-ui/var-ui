'use client';

import { Button, HStack } from '@var-ui/react';

export function StackDemo() {
  return (
    <HStack gap="sm">
      <Button intent="secondary">Cancel</Button>
      <Button>Save</Button>
    </HStack>
  );
}
