'use client';

import { Tabs, Text } from '@var-ui/react';

export function TabsDemo() {
  return (
    <Tabs
      tabs={[
        { id: 'overview', label: 'Overview', content: <Text>First panel content.</Text> },
        { id: 'details', label: 'Details', content: <Text>Second panel content.</Text> },
      ]}
    />
  );
}
