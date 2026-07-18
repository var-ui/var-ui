'use client';

import { codeHljsScope } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, LayerProvider, recipeClassName } from '@var-ui/react';
import { useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { DocsHeader } from '@/components/DocsHeader';
import { MobileNavProvider } from '@/contexts/MobileNavContext';
import { COLOR_MODE_STORAGE_KEY } from '@/lib/color-mode';
import { docsShell } from '@/styles/docsShell';

function useIsDocsSection() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    pathname.startsWith('/docs') ||
    pathname.startsWith('/components') ||
    pathname.startsWith('/theming')
  );
}

export function DocsProviders({ children }: { children: ReactNode }) {
  const shell = docsShell();
  const isDocsSection = useIsDocsSection();

  const content = (
    <DesignSystemProvider
      applyToDocument
      defaultColorMode="system"
      storageKey={COLOR_MODE_STORAGE_KEY}
    >
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <div className={recipeClassName(shell.root)}>
            <DocsHeader showMobileNav={isDocsSection} />
            <div className={recipeClassName(codeHljsScope().root)}>{children}</div>
          </div>
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );

  if (isDocsSection) {
    return <MobileNavProvider>{content}</MobileNavProvider>;
  }

  return content;
}
