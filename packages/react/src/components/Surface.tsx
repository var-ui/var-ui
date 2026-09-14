import type { HTMLAttributes, JSX } from 'react';
import { surface } from '@var-ui/core';
import { recipeProps } from './utils';

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  /** @default md */
  padding?: 'sm' | 'md';
};

/** Bordered content box without title/body slots. */
export function Surface({
  className,
  padding = 'md',
  children,
  ...props
}: SurfaceProps): JSX.Element {
  return (
    <div {...props} {...recipeProps(surface({ padding }), className)}>
      {children}
    </div>
  );
}
