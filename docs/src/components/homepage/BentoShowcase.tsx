'use client';

import { cx, recipeClassName } from '@var-ui/react';
import { useState } from 'react';
import { homeBento } from '@/styles/homeBento';
import { BannerTile } from './bentoTiles/BannerTile';
import { CarouselStripTile } from './bentoTiles/CarouselStripTile';
import { ContentSampleTile } from './bentoTiles/ContentSampleTile';
import { EmptyStateDialogTile } from './bentoTiles/EmptyStateDialogTile';
import { IdentityCardsTile } from './bentoTiles/IdentityCardsTile';
import { LayoutTabsTile } from './bentoTiles/LayoutTabsTile';
import { QuickActionsTile } from './bentoTiles/QuickActionsTile';
import { SettingsFormTile } from './bentoTiles/SettingsFormTile';
import { StatusFeedbackTile } from './bentoTiles/StatusFeedbackTile';
import { SHOWCASE_THEMES, type ShowcaseThemeId } from './ThemeShowcaseSwitcher';

export type BentoShowcaseProps = {
  themeId: ShowcaseThemeId;
};

export function BentoShowcase({ themeId }: BentoShowcaseProps) {
  const b = homeBento();
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const theme = SHOWCASE_THEMES.find((entry) => entry.id === themeId) ?? SHOWCASE_THEMES[0];

  return (
    <div
      className={cx(recipeClassName(b.showcase), theme.className)}
      data-testid="bento-showcase"
      ref={setPortalContainer}
      // Theme surfaces ship `color-scheme: light dark`; inherit from the docs site instead.
      style={{ colorScheme: 'inherit' }}
    >
      <div className={recipeClassName(b.grid)}>
        <QuickActionsTile
          className={cx(
            recipeClassName(b.tile),
            recipeClassName(b.tileSpan2),
            recipeClassName(b.tileRowSpan2),
          )}
          portalContainer={portalContainer ?? undefined}
        />
        <StatusFeedbackTile className={recipeClassName(b.tile)} />
        <SettingsFormTile
          className={cx(recipeClassName(b.tile), recipeClassName(b.tileRowSpan2))}
        />
        <EmptyStateDialogTile
          className={recipeClassName(b.tile)}
          portalContainer={portalContainer ?? undefined}
        />
        <ContentSampleTile className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))} />
        <IdentityCardsTile className={recipeClassName(b.tile)} />
        <CarouselStripTile className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))} />
        <LayoutTabsTile className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))} />
        <BannerTile className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpanFull))} />
      </div>
    </div>
  );
}
