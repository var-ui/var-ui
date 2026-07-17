'use client';

import { Button, cx, type ButtonProps, recipeClassName } from '@var-ui/react';
import type { ReactNode } from 'react';
import { docsShell } from '@/styles/docsShell';

export type HeaderIconButtonProps = Omit<ButtonProps, 'children'> & {
  label: string;
  children: ReactNode;
};

export function HeaderIconButton({
  label,
  children,
  className,
  intent = 'ghost',
  ...props
}: HeaderIconButtonProps) {
  const shell = docsShell();

  return (
    <Button
      {...props}
      aria-label={label}
      className={cx(recipeClassName(shell.headerIconButton), className)}
      intent={intent}
    >
      {children}
    </Button>
  );
}
