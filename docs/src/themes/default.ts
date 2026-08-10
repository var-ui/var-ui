import { createDesignTheme } from '@var-ui/core';

/**
 * Ensures the default theme surface CSS is extracted into `typestyles.css`.
 * Other showcase themes are extracted to `/themes/<id>.css` via `typestyles-themes/*`.
 */
export const defaultTheme = createDesignTheme({ name: 'default' });
