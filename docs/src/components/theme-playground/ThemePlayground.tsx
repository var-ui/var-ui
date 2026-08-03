'use client';

import { defaultIcons } from '@var-ui/icons';
import {
  Button,
  DesignSystemProvider,
  IconProvider,
  LayerProvider,
  readStoredColorMode,
  recipeClassName,
  type ColorMode,
} from '@var-ui/react';
import { SegmentedControl } from '../../../../packages/react/src/components/SegmentedControl';
import type { Selection } from 'react-aria-components';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { HighlightedCodeBlock } from '../HighlightedCodeBlock';
import { BentoShowcase } from '../homepage/BentoShowcase';
import { ThemeShowcaseSwitcher } from '../homepage/ThemeShowcaseSwitcher';
import { themePlaygroundStyles } from '@/styles/themePlayground';
import { generateThemeCode } from './generateThemeCode';
import {
  DEFAULT_THEME_PLAYGROUND_STATE,
  type ThemePlaygroundState,
  type ThemePlaygroundViewport,
} from './themePlaygroundState';

const STORAGE_KEY = 'theme-mode';

const VIEWPORT_OPTIONS = [
  { id: 'desktop' as const, label: 'Desktop' },
  { id: 'mobile' as const, label: 'Mobile' },
];

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  const s = themePlaygroundStyles();
  return (
    <div className={recipeClassName(s.controlGroup)}>
      <span className={recipeClassName(s.controlLabel)}>{label}</span>
      {children}
    </div>
  );
}

export default function ThemePlayground() {
  const [state, setState] = useState<ThemePlaygroundState>(DEFAULT_THEME_PLAYGROUND_STATE);
  const [colorMode, setColorMode] = useState<ColorMode>(
    () => readStoredColorMode(STORAGE_KEY) ?? 'system',
  );
  const s = themePlaygroundStyles();

  const syncColorModeFromStorage = useCallback(() => {
    const stored = readStoredColorMode(STORAGE_KEY);
    if (stored !== undefined) setColorMode(stored);
  }, []);

  useEffect(() => {
    syncColorModeFromStorage();
    const observer = new MutationObserver(() => syncColorModeFromStorage());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode'],
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) syncColorModeFromStorage();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, [syncColorModeFromStorage]);

  const codeOutput = useMemo(() => generateThemeCode(state), [state]);

  const handleExport = async () => {
    await navigator.clipboard.writeText(codeOutput.code);
  };

  return (
    <DesignSystemProvider
      colorMode={colorMode}
      defaultColorMode="system"
      onColorModeChange={(next) => {
        setColorMode(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      }}
      storageKey={STORAGE_KEY}
    >
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <div className={recipeClassName(s.root)} data-theme-playground>
            <div className={recipeClassName(s.workspace)}>
              <aside className={recipeClassName(s.controls)} aria-label="Theme options">
                <ControlGroup label="Theme preset">
                  <ThemeShowcaseSwitcher
                    selected={state.presetId}
                    onSelect={(presetId) => setState((prev) => ({ ...prev, presetId }))}
                  />
                </ControlGroup>
              </aside>
              <div className={recipeClassName(s.preview)}>
                <div className={recipeClassName(s.toolbar)}>
                  <SegmentedControl
                    aria-label="Preview viewport"
                    options={VIEWPORT_OPTIONS}
                    selectedKeys={[state.viewport]}
                    onSelectionChange={(keys: Selection) => {
                      if (keys === 'all') return;
                      const id = [...keys][0] as ThemePlaygroundViewport;
                      if (id) setState((prev) => ({ ...prev, viewport: id }));
                    }}
                  />
                  <Button appearance="outline" size="sm" onPress={handleExport}>
                    Export
                  </Button>
                </div>
                <div className={recipeClassName(s.previewInner)}>
                  <div
                    className={recipeClassName(
                      state.viewport === 'mobile' ? s.previewFrameMobile : s.previewFrame,
                    )}
                  >
                    <BentoShowcase themeId={state.presetId} />
                  </div>
                </div>
              </div>
            </div>
            <div className={recipeClassName(s.code)}>
              <HighlightedCodeBlock
                code={codeOutput.code}
                language={codeOutput.language}
                filename={codeOutput.filename}
              />
            </div>
          </div>
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
