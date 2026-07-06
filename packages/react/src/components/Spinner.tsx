import type { CSSProperties, JSX } from 'react';
import { spinner } from '@var-ui/core';
import { cx } from './utils';

export type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'accent' | 'neutral';
  /** Accessible loading announcement. */
  label?: string;
  className?: string;
};

const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Indeterminate loading indicator with a screen-reader-only status label.
 *
 * ```tsx
 * <Spinner size="lg" label="Loading results" />
 * ```
 */
export function Spinner({
  size = 'md',
  tone = 'accent',
  label = 'Loading',
  className,
}: SpinnerProps): JSX.Element {
  return (
    <span role="status" className={className}>
      <span className={cx(spinner({ size, tone }))} aria-hidden="true" />
      <span style={visuallyHidden}>{label}</span>
    </span>
  );
}
