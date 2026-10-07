/**
 * Build-time CSS extraction entry for `@typestyles/vite`.
 *
 * Re-export registrations (do not use side-effect-only imports). `themeableComponents`
 * pins every themeable recipe handle so `vp pack` cannot emit an empty `dist/styles.mjs`
 * (hosts would otherwise miss recipes, document globals, and the default theme).
 *
 * ```ts
 * // typestyles-entry.ts
 * import '@var-ui/core/styles';
 *
 * // Optional: custom themes and app-owned `styles.component()` modules
 * import './my-theme';
 * ```
 */
import { getRegisteredComponentRefs } from 'typestyles';
import './components';
import { styles } from './runtime';

/** Pins every themeable recipe handle for the extract bundle — not part of `@var-ui/core` main exports. */
export const themeableComponents = getRegisteredComponentRefs(styles);
export { hiddenClassName, hiddenStyle } from './components/hidden';
export { layout, text } from './components/styles';
export { registerBaseStyles } from './theme/base-styles';
export { defaultTheme, registerDefaultTheme } from './theme/register-default';
