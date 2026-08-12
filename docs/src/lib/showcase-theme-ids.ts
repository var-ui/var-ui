import { docsThemePresets, type ShowcaseThemeId } from '@/themes/presets';
import { getDocsThemeStylesHref as kitGetHref, getLazyThemePresets } from '@var-ui/docs/utils';

export type LazyDocsThemeId = Exclude<ShowcaseThemeId, 'default'>;

export const LAZY_DOCS_THEME_IDS = getLazyThemePresets(docsThemePresets).map(
  (preset) => preset.id,
) as LazyDocsThemeId[];

export function isLazyDocsThemeId(value: string): value is LazyDocsThemeId {
  return (LAZY_DOCS_THEME_IDS as readonly string[]).includes(value);
}

export function getDocsThemeStylesHref(themeId: ShowcaseThemeId): string | undefined {
  return kitGetHref(themeId, docsThemePresets);
}
