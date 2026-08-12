export type { DocsBrand, DocsSearchItem, SidebarItem, SidebarSection, TopNavItem } from '../types';

export {
  DOCS_TOC_CONTENT_SELECTOR,
  DOCS_TOC_HEADING_SELECTOR,
  normalizeDocsPath,
  shouldShowDocsToc,
  type DocsTocOptions,
} from './docs-toc';

export { reattachTypestyles } from './reattachTypestyles';

export {
  DEFAULT_GUIDE_ROUTES,
  guideInjectPatterns,
  matchGuideRoute,
  resolveGuideRouteConfig,
  type GuideRoutePrefix,
  type ResolvedGuideRoute,
} from './routing';

export {
  createDocsThemeController,
  ensureDocsThemeStyles,
  resetDocsThemeStylesForTests,
  type DocsThemeController,
} from './theme/docs-theme';

export {
  createThemeClassMap,
  getAllThemeClassNames,
  getDocsThemeStylesHref,
  getLazyThemePresets,
  resolveThemePresets,
  type DocsThemePreset,
  type ResolvedDocsThemePreset,
} from './theme/presets';

export { extractThemeOnlyCss } from './theme/extract-theme-css';
