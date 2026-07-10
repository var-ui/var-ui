'use client';

import { Card, CodeBlock, Heading, VStack } from '@var-ui/react';
import { useState, type ReactNode } from 'react';

export type DemoProps = {
  children: ReactNode;
  code: string;
  title?: string;
};

export function Demo({ children, code, title }: DemoProps) {
  const [showCode, setShowCode] = useState(false);

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
      <button type="button" onClick={() => setShowCode((v) => !v)}>
        {showCode ? 'Hide code' : 'Show code'}
      </button>
      {showCode ? <CodeBlock code={code} language="tsx" /> : null}
    </VStack>
  );
}
