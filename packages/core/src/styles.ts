/**
 * Build-time CSS extraction entry for `@typestyles/vite`.
 *
 * Re-export the registrations (do not use side-effect-only imports). `vp pack`
 * tree-shakes unused specifiers, and an empty `dist/styles.mjs` means hosts that
 * import `@var-ui/core/styles` never get recipes, base HTML styles, or the
 * default theme — CSS variables then fall back to `@property` initials.
 *
 * ```ts
 * // typestyles-entry.ts
 * import '@var-ui/core/styles';
 *
 * // Optional: custom themes and app-owned `styles.component()` modules
 * import './my-theme';
 * ```
 */
export { themeableComponents } from './themeable-components';
export { hiddenClassName, hiddenStyle } from './components/hidden';
export { layout, text } from './components/styles';
export { registerBaseStyles } from './base-styles';
export { registerDefaultTheme } from './register-default-theme';
