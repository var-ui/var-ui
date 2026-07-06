'use client';

import { codeHljsScope } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, LayerProvider } from '@var-ui/react';
import type { ReactNode } from 'react';
import { docsShell } from '@/styles/docsShell';

export function DocsProviders({ children }: { children: ReactNode }) {
  const shell = docsShell();

  return (
    <DesignSystemProvider defaultTheme="light">
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <div className={shell.root}>
            <div className={codeHljsScope().root}>{children}</div>
          </div>
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
