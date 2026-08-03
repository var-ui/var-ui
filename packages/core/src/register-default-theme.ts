import { createDesignThemeBase } from './create-theme-base';
import { DEFAULT_THEME_NAME } from './theme-constants';

/** Register the built-in default theme surface (`theme-var-ui-default`). */
export function registerDefaultTheme(): void {
  createDesignThemeBase({ name: DEFAULT_THEME_NAME });
}

registerDefaultTheme();
