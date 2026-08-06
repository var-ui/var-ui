import { createDesignTheme } from '@var-ui/core';

/**
 * Ensures the default theme surface CSS is extracted into `typestyles.css`.
 * BaseLayout applies `defaultThemeClassName` on `<html>`; without this import the
 * built stylesheet only includes custom showcase themes from `src/themes/*`.
 */
export const defaultTheme = createDesignTheme({ name: 'default' });
