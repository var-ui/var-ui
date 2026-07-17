import type { HTMLAttributes, JSX } from 'react';
import { center } from '@var-ui/core';
import { recipeProps } from './utils';

export type CenterProps = HTMLAttributes<HTMLDivElement> & {
  /** Use inline-grid so the box shrink-wraps inside text flow. @default false */
  inline?: boolean;
};

/** Centers children on both axes. */
export function Center({ inline = false, className, ...props }: CenterProps): JSX.Element {
  return (
    <div {...props} {...recipeProps(center({ inline: inline ? 'true' : 'false' }), className)} />
  );
}
