import type { JSX } from 'react';
import { statusDot } from '@var-ui/core';
import { recipeProps } from './utils';

export type StatusDotProps = {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  pulse?: boolean;
  /** Required for a11y when no adjacent visible text names the status. */
  'aria-label'?: string;
  className?: string;
};

/** Semantic presence/status indicator. */
export function StatusDot({
  tone = 'neutral',
  pulse = false,
  'aria-label': ariaLabel,
  className,
}: StatusDotProps): JSX.Element {
  return (
    <span
      {...recipeProps(statusDot({ tone, pulse: pulse ? 'true' : 'false' }), className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
}
