import type { ShowcaseThemeId } from '@/components/homepage/showcaseThemes';

/** Showcase themes with a separate extracted stylesheet (not bundled in typestyles.css). */
export const LAZY_DOCS_THEME_IDS = [
  'forest',
  'rose',
  'amber',
  'ai-glow',
  'new-wave',
  'windows-95',
  'classic-system',
] as const satisfies readonly Exclude<ShowcaseThemeId, 'default'>[];

export type LazyDocsThemeId = (typeof LAZY_DOCS_THEME_IDS)[number];

export function isLazyDocsThemeId(value: string): value is LazyDocsThemeId {
  return (LAZY_DOCS_THEME_IDS as readonly string[]).includes(value);
}

export function getDocsThemeStylesHref(themeId: ShowcaseThemeId): string | undefined {
  if (themeId === 'default') return undefined;
  return `/themes/${themeId}.css`;
}
