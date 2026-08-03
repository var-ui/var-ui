/**
 * Implementation details, docs metadata, and test registries.
 * Prefer `@var-ui/core` for recipes, tokens, and theme APIs.
 */
export * from './components/semanticTone';
export {
  createDesignThemeBase,
  deepMergeThemeOverrides,
  mergeThemeOverrides,
  type ExtendMap,
} from './create-theme-base';
export { registerExtendMap, resetExtendTokenRegistry } from './extend-tokens';
export { resetRegisteredFontFaces } from './fonts/register-font-face';
export { registerBaseStyles } from './base-styles';
export { registerDocumentGlobals, registerGlobals } from './document-globals';
export { registerColorSchemeGlobals } from './runtime';
export * from './tocSpy';
export * from './tabsIndicator';
export * from './segmentedControlIndicator';
export { proseContent } from './components/proseContent';
export { layout as layoutUtility, text } from './components/styles';
export { namedContainerQuery } from './components/namedContainerQuery';
export {
  fieldChrome,
  dateFieldChrome,
  calendarGridChrome,
  type FieldChromeColors,
  type DateFieldChromeColors,
  type CalendarGridChromeColors,
} from './components/field';
export { alertVariantPropDocs } from './components/alert';
export { avatarVariantPropDocs } from './components/avatar';
export { badgeVariantPropDocs } from './components/badge';
export { bannerVariantPropDocs } from './components/banner';
export { buttonVariantPropDocs } from './components/button';
export { collapsibleVariantPropDocs } from './components/collapsible';
export { drawerVariantPropDocs } from './components/drawer';
export { progressBarVariantPropDocs } from './components/progressBar';
export { spinnerVariantPropDocs } from './components/spinner';
export { statusDotVariantPropDocs } from './components/statusDot';
export { toastVariantPropDocs } from './components/toast';
