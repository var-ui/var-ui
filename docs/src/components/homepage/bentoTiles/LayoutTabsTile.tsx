'use client';

import { Card, Center, Grid, Section, Tabs, Text } from '@var-ui/react';

export type LayoutTabsTileProps = {
  className?: string;
};

export function LayoutTabsTile({ className }: LayoutTabsTileProps) {
  return (
    <div className={className}>
      <Section title="Layout preview">
        <Tabs
          tabs={[
            {
              id: 'grid',
              label: 'Grid',
              content: (
                <Grid columns={2} gap="sm">
                  <Card title="A">Cell</Card>
                  <Card title="B">Cell</Card>
                </Grid>
              ),
            },
            {
              id: 'center',
              label: 'Center',
              content: (
                <Center style={{ height: '80px' }}>
                  <Text tone="secondary">Centered content</Text>
                </Center>
              ),
            },
          ]}
        />
      </Section>
    </div>
  );
}
