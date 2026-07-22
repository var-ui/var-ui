'use client';

import { CodeBlock, Heading, Link, Text, Timestamp, VStack } from '@var-ui/react';

export type ContentSampleTileProps = {
  className?: string;
};

export function ContentSampleTile({ className }: ContentSampleTileProps) {
  return (
    <div className={className}>
      <VStack gap="sm">
        <Heading level={3} size="sm">
          Release notes
        </Heading>
        <Text size="sm" tone="secondary">
          Published <Timestamp date="2026-06-30T12:00:00Z" format="date" />
        </Text>
        <Text>
          Themes pin fixed-tone subtrees with modes and <code>data-surface</code> (
          <code>SURFACE_ATTRIBUTE</code>). See <Link href="/theming">the theming guide</Link> for
          details.
        </Text>
        <CodeBlock code={"import { Button } from '@var-ui/react';"} language="tsx" />
      </VStack>
    </div>
  );
}
