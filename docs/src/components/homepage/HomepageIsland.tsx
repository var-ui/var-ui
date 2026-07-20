import { defaultIcons } from '@var-ui/icons';
import {
  DesignSystemProvider,
  IconProvider,
  LayerProvider,
  readStoredColorMode,
  type ColorMode,
} from '@var-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BentoShowcase } from './BentoShowcase';
import { ThemeShowcaseSwitcher, type ShowcaseThemeId } from './ThemeShowcaseSwitcher';

const STORAGE_KEY = 'theme-mode';

function readInitialColorMode(): ColorMode {
  return readStoredColorMode(STORAGE_KEY) ?? 'system';
}

/**
 * Homepage product theater: always `@var-ui/react` tiles (portals, themes, RAC).
 * Framework cookie / DemoHost registry does not drive this surface.
 *
 * Color mode is controlled and synced with Astro header `ColorModeToggle`, which writes
 * `theme-mode` + `document.documentElement[data-mode]` in-tab (no `storage` event).
 */
export default function HomepageIsland() {
  const [showcaseThemeId, setShowcaseThemeId] = useState<ShowcaseThemeId>('default');
  const [colorMode, setColorMode] = useState<ColorMode>(readInitialColorMode);

  const syncColorModeFromStorage = useCallback(() => {
    const stored = readStoredColorMode(STORAGE_KEY);
    if (stored !== undefined) {
      setColorMode(stored);
    }
  }, []);

  useEffect(() => {
    syncColorModeFromStorage();

    const observer = new MutationObserver(() => {
      syncColorModeFromStorage();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-mode'],
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        syncColorModeFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, [syncColorModeFromStorage]);

  const handleColorModeChange = useCallback((nextColorMode: ColorMode) => {
    setColorMode(nextColorMode);
    window.localStorage.setItem(STORAGE_KEY, nextColorMode);
  }, []);

  return (
    <DesignSystemProvider
      colorMode={colorMode}
      defaultColorMode="system"
      onColorModeChange={handleColorModeChange}
      storageKey={STORAGE_KEY}
    >
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <ThemeShowcaseSwitcher onSelect={setShowcaseThemeId} selected={showcaseThemeId} />
          <BentoShowcase themeId={showcaseThemeId} />
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
