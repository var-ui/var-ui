'use client';

import { Button, type ButtonProps } from '@var-ui/react';
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
      className={`${shell.headerIconButton} ${className ?? ''}`}
      intent={intent}
    >
      {children}
    </Button>
  );
}
