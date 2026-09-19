import type { JSX, ReactNode } from 'react';
import { inlineCode } from '@var-ui/core/inlineCode';
import { recipeProps } from './utils';

export type CodeProps = {
  children: ReactNode;
  className?: string;
};

/** Inline code snippet styling. */
export function Code({ children, className }: CodeProps): JSX.Element {
  return <code {...recipeProps(inlineCode(), className)}>{children}</code>;
}
