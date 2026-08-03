import type { CSSProperties, JSX } from 'react';
import { spinner, type SpinnerVariantProps } from '@var-ui/core';
import { recipeProps } from './utils';

export type SpinnerProps = SpinnerVariantProps & {
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

export function Spinner({
  size = 'md',
  tone = 'accent',
  appearance = 'solid',
  label = 'Loading',
  className,
}: SpinnerProps): JSX.Element {
  return (
    <span role="status" className={className}>
      <span {...recipeProps(spinner({ size, tone, appearance }))} aria-hidden="true" />
      <span style={visuallyHidden}>{label}</span>
    </span>
  );
}
