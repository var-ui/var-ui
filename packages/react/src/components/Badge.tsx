import type { HTMLAttributes, JSX } from 'react';
import { badge } from '@var-ui/core';
import { cx } from './utils';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'tip';
};

/**
 * Small semantic label chip.
 *
 * ```tsx
 * <Badge tone="success">Active</Badge>
 * ```
 */
export function Badge({ tone = 'neutral', className, ...props }: BadgeProps): JSX.Element {
  return <span {...props} className={cx(badge({ tone }), className)} />;
}
