/**
 * Build-time CSS extraction entry for `@typestyles/vite`.
 *
 * Side-effect import registers every component recipe, base HTML styles,
 * layout utilities, and the built-in default theme.
 *
 * ```ts
 * // typestyles-entry.ts
 * import '@var-ui/core/styles';
 *
 * // Optional: custom themes and app-owned `styles.component()` modules
 * import './my-theme';
 * ```
 */
import './themeable-components';
import './components/styles';
import './base-styles';
import './register-default-theme';
