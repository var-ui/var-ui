'use client';

import { proseContent } from '@var-ui/core';
import { recipeClassName } from '@var-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ComponentIndex } from '@/components/ComponentIndex';
import { DocsHomeChrome } from '@/components/DocsChrome';
import { BentoShowcase } from '@/components/homepage/BentoShowcase';
import {
  ThemeShowcaseSwitcher,
  type ShowcaseThemeId,
} from '@/components/homepage/ThemeShowcaseSwitcher';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const prose = proseContent();
  const [showcaseThemeId, setShowcaseThemeId] = useState<ShowcaseThemeId>('default');

  return (
    <DocsHomeChrome>
      <div
        className={recipeClassName(prose.root)}
        style={{ maxWidth: '64rem', margin: '2rem auto', padding: '0 1rem' }}
      >
        <h1>Var UI</h1>
        <p>
          An open-source design system built on TypeStyles and React Aria Components. Explore the
          docs, browse components, or learn about theming from the navigation above.
        </p>

        <ThemeShowcaseSwitcher onSelect={setShowcaseThemeId} selected={showcaseThemeId} />
        <BentoShowcase themeId={showcaseThemeId} />

        <h2>Explore</h2>
        <ul>
          <li>
            <a href="/docs">Documentation</a> — installation and getting started guides
          </li>
          <li>
            <a href="/components">Components</a> — live demos for every exported component
          </li>
          <li>
            <a href="/theming">Theming</a> — tokens, themes, and color modes
          </li>
        </ul>

        <h2>Component catalog</h2>
        <ComponentIndex />
      </div>
    </DocsHomeChrome>
  );
}
