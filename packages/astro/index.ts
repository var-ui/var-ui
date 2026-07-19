export { cx, recipeClassName, recipeProps, type RecipeClass } from './src/utils';
export { default as ThemeScript } from './src/theme/ThemeScript.astro';
export { default as ColorModeToggle } from './src/theme/ColorModeToggle.astro';
export type { ColorMode, ResolvedColorMode } from './src/scripts/colorMode';
export {
  applyColorModeToDocument,
  bootTheme,
  initColorModeToggle,
  persistColorMode,
  readStoredColorMode,
  resolveColorMode,
  setColorMode,
} from './src/scripts/colorMode';
