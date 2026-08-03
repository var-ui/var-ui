import type { ShowcaseThemeId } from '../homepage/showcaseThemes';

export type ThemePlaygroundViewport = 'desktop' | 'mobile';

export type ThemePlaygroundState = {
  presetId: ShowcaseThemeId;
  viewport: ThemePlaygroundViewport;
};

export const DEFAULT_THEME_PLAYGROUND_STATE: ThemePlaygroundState = {
  presetId: 'default',
  viewport: 'desktop',
};
