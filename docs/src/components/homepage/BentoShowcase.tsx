'use client';

import type { DocsFramework } from '@/lib/framework';
import { cx, recipeClassName } from '@var-ui/react';
import { useState, type CSSProperties } from 'react';
import { homeBento } from '@/styles/homeBento';
import {
  renderBannerTileMarkup,
  renderCarouselStripTileMarkup,
  renderContentSampleTileMarkup,
  renderEmptyStateDialogTileMarkup,
  renderIdentityCardsTileMarkup,
  renderLayoutTabsTileMarkup,
  renderQuickActionsTileMarkup,
  renderSettingsFormTileMarkup,
  renderStatusFeedbackTileMarkup,
} from './bentoMarkup';
import { BannerTile } from './bentoTiles/BannerTile';
import { CarouselStripTile } from './bentoTiles/CarouselStripTile';
import { ContentSampleTile } from './bentoTiles/ContentSampleTile';
import { EmptyStateDialogTile } from './bentoTiles/EmptyStateDialogTile';
import { IdentityCardsTile } from './bentoTiles/IdentityCardsTile';
import { LayoutTabsTile } from './bentoTiles/LayoutTabsTile';
import { QuickActionsTile } from './bentoTiles/QuickActionsTile';
import { SettingsFormTile } from './bentoTiles/SettingsFormTile';
import { StatusFeedbackTile } from './bentoTiles/StatusFeedbackTile';
import { MarkupTile } from './MarkupTile';
import { SHOWCASE_THEMES, type ShowcaseThemeId } from './showcaseThemes';

export type BentoShowcaseProps = {
  themeId: ShowcaseThemeId;
  framework?: DocsFramework;
  previewStyle?: CSSProperties;
};

export function BentoShowcase({ themeId, framework = 'react', previewStyle }: BentoShowcaseProps) {
  const b = homeBento();
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const theme = SHOWCASE_THEMES.find((entry) => entry.id === themeId) ?? SHOWCASE_THEMES[0];
  const useReactTiles = framework === 'react';

  return (
    <div
      className={cx(recipeClassName(b.showcase), theme.className)}
      data-framework={framework}
      data-testid="bento-showcase"
      ref={setPortalContainer}
      style={{ colorScheme: 'inherit', ...previewStyle }}
    >
      <div className={recipeClassName(b.grid)}>
        {useReactTiles ? (
          <QuickActionsTile
            className={cx(
              recipeClassName(b.tile),
              recipeClassName(b.tileSpan2),
              recipeClassName(b.tileRowSpan2),
            )}
            portalContainer={portalContainer ?? undefined}
          />
        ) : (
          <MarkupTile
            className={cx(
              recipeClassName(b.tile),
              recipeClassName(b.tileSpan2),
              recipeClassName(b.tileRowSpan2),
            )}
            html={renderQuickActionsTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <StatusFeedbackTile className={recipeClassName(b.tile)} />
        ) : (
          <MarkupTile className={recipeClassName(b.tile)} html={renderStatusFeedbackTileMarkup()} />
        )}
        {useReactTiles ? (
          <SettingsFormTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileRowSpan2))}
          />
        ) : (
          <MarkupTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileRowSpan2))}
            html={renderSettingsFormTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <EmptyStateDialogTile
            className={recipeClassName(b.tile)}
            portalContainer={portalContainer ?? undefined}
          />
        ) : (
          <MarkupTile
            className={recipeClassName(b.tile)}
            html={renderEmptyStateDialogTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <ContentSampleTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))}
            framework={framework}
          />
        ) : (
          <MarkupTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))}
            html={renderContentSampleTileMarkup(framework)}
          />
        )}
        {useReactTiles ? (
          <IdentityCardsTile className={recipeClassName(b.tile)} />
        ) : (
          <MarkupTile className={recipeClassName(b.tile)} html={renderIdentityCardsTileMarkup()} />
        )}
        {useReactTiles ? (
          <CarouselStripTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))}
          />
        ) : (
          <MarkupTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))}
            html={renderCarouselStripTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <LayoutTabsTile className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))} />
        ) : (
          <MarkupTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpan2))}
            html={renderLayoutTabsTileMarkup()}
          />
        )}
        {useReactTiles ? (
          <BannerTile className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpanFull))} />
        ) : (
          <MarkupTile
            className={cx(recipeClassName(b.tile), recipeClassName(b.tileSpanFull))}
            html={renderBannerTileMarkup()}
          />
        )}
      </div>
    </div>
  );
}
