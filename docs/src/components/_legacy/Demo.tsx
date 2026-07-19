'use client';

import { Card, CodeBlock, Collapsible, Heading, VStack } from '@var-ui/react';
import type { ReactNode } from 'react';

export type DemoProps = {
  children: ReactNode;
  code: string;
  title?: string;
};

export function Demo({ children, code, title }: DemoProps) {
  return (
    <VStack gap="sm" style={{ marginBlock: '1.5rem' }}>
      {title ? (
        <Heading level={4} size="sm">
          {title}
        </Heading>
      ) : null}
      <Card>
        <div style={{ padding: '1.25rem' }}>{children}</div>
      </Card>
      <Collapsible title="Show code" defaultExpanded={false}>
        <CodeBlock code={code} language="tsx" />
      </Collapsible>
    </VStack>
  );
}
