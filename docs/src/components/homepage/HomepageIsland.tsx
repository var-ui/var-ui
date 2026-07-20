import { defaultIcons } from '@var-ui/icons';
import { DesignSystemProvider, IconProvider, LayerProvider } from '@var-ui/react';
import { useState } from 'react';
import { BentoShowcase } from './BentoShowcase';
import { ThemeShowcaseSwitcher, type ShowcaseThemeId } from './ThemeShowcaseSwitcher';

/**
 * Homepage product theater: always `@var-ui/react` tiles (portals, themes, RAC).
 * Framework cookie / DemoHost registry does not drive this surface.
 */
export default function HomepageIsland() {
  const [showcaseThemeId, setShowcaseThemeId] = useState<ShowcaseThemeId>('default');

  return (
    <DesignSystemProvider defaultColorMode="system" storageKey="theme-mode">
      <IconProvider icons={defaultIcons}>
        <LayerProvider>
          <ThemeShowcaseSwitcher onSelect={setShowcaseThemeId} selected={showcaseThemeId} />
          <BentoShowcase themeId={showcaseThemeId} />
        </LayerProvider>
      </IconProvider>
    </DesignSystemProvider>
  );
}
