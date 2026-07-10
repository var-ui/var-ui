'use client';

import { Button, HStack } from '@var-ui/react';

export function ButtonDefaultDemo() {
  return <Button>Click me</Button>;
}

export function ButtonVariantsDemo() {
  return (
    <HStack gap="sm" wrap>
      <Button intent="primary">Primary</Button>
      <Button intent="secondary">Secondary</Button>
      <Button intent="ghost">Ghost</Button>
    </HStack>
  );
}

export function ButtonDisabledDemo() {
  return (
    <HStack gap="sm" wrap>
      <Button isDisabled>Disabled</Button>
      <Button intent="primary" isDisabled>
        Disabled primary
      </Button>
    </HStack>
  );
}
