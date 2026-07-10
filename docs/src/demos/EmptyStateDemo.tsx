'use client';

import { Button, EmptyState, Icon } from '@var-ui/react';

export function EmptyStateDemo() {
  return (
    <EmptyState
      icon={<Icon name="search" size="lg" />}
      title="No results"
      description="Try a different filter, or clear the search."
      action={<Button intent="primary">Clear filters</Button>}
    />
  );
}
