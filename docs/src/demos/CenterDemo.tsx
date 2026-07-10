'use client';

import { Center, Text } from '@var-ui/react';

export function CenterDemo() {
  return (
    <Center style={{ height: '120px', border: '1px dashed var(--color-border)' }}>
      <Text>Centered</Text>
    </Center>
  );
}
