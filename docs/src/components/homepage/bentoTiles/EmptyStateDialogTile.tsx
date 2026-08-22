'use client';

import { EmptyState, Icon, SimpleDialog } from '@var-ui/react';

export type EmptyStateDialogTileProps = {
  className?: string;
  portalContainer?: Element;
};

export function EmptyStateDialogTile({ className, portalContainer }: EmptyStateDialogTileProps) {
  return (
    <div className={className}>
      <EmptyState
        action={
          <SimpleDialog
            description="Give your project a name. You can rename it later."
            portalContainer={portalContainer}
            title="Create a project"
            triggerLabel="New project"
          />
        }
        description="Create your first project to get started."
        icon={<Icon name="search" size="lg" />}
        title="No projects yet"
      />
    </div>
  );
}
