import type { JSX, ReactNode } from 'react';
import { emptyState } from '@var-ui/core';
import { cx } from './utils';

export type EmptyStateProps = {
  /** Decorative glyph or illustration; consumers pass `<Icon>` or a custom node. */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * Empty-list placeholder: icon well, headline, supporting copy, call to
 * action.
 *
 * ```tsx
 * <EmptyState
 *   icon={<Icon name="search" size="lg" />}
 *   title="No results"
 *   description="Try a different filter."
 *   action={<Button>Clear filters</Button>}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): JSX.Element {
  const e = emptyState();
  return (
    <div className={cx(e.root, className)}>
      {icon ? (
        <div className={e.icon} data-empty-state-icon aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className={e.title}>{title}</h3>
      {description ? <p className={e.description}>{description}</p> : null}
      {action ? <div className={e.action}>{action}</div> : null}
    </div>
  );
}
