'use client';

import { codeHljsScope } from '@var-ui/core';
import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, LayerProvider, recipeClassName } from '@var-ui/react';
import type { ReactNode } from 'react';
import { COLOR_MODE_STORAGE_KEY } from '@/lib/color-mode';

export function DocsProviders({ children }: { children: ReactNode }) {
  return (
    <DesignSystemProvider
      applyToDocument
      defaultColorMode="system"
      storageKey={COLOR_MODE_STORAGE_KEY}
    >
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <div className={recipeClassName(codeHljsScope().root)}>{children}</div>
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
