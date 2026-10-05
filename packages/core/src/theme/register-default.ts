import { createDesignTheme } from './create-theme';
import { DEFAULT_THEME_NAME } from './constants';

/** Register the built-in default theme surface (`theme-var-ui-default`). */
export function registerDefaultTheme(): void {
  createDesignTheme({ name: DEFAULT_THEME_NAME });
}

registerDefaultTheme();
