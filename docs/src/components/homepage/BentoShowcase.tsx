'use client';

import { useDesignSystemTheme } from '@var-ui/react';
import { useState } from 'react';
import { cx } from 'typestyles';
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
  const { theme: mode } = useDesignSystemTheme();
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const theme = SHOWCASE_THEMES.find((entry) => entry.id === themeId) ?? SHOWCASE_THEMES[0];

  return (
    <div
      className={cx(b.showcase, theme.className)}
      data-mode={mode}
      data-testid="bento-showcase"
      ref={setPortalContainer}
    >
      <div className={b.grid}>
        <QuickActionsTile
          className={cx(b.tile, b.tileSpan2, b.tileRowSpan2)}
          portalContainer={portalContainer ?? undefined}
        />
        <StatusFeedbackTile className={b.tile} />
        <SettingsFormTile className={cx(b.tile, b.tileRowSpan2)} />
        <EmptyStateDialogTile className={b.tile} portalContainer={portalContainer ?? undefined} />
        <ContentSampleTile className={cx(b.tile, b.tileSpan2)} />
        <IdentityCardsTile className={b.tile} />
        <CarouselStripTile className={cx(b.tile, b.tileSpan2)} />
        <LayoutTabsTile className={cx(b.tile, b.tileSpan2)} />
        <BannerTile className={cx(b.tile, b.tileSpanFull)} />
      </div>
    </div>
  );
}
