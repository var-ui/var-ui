import type { OverrideConfigFor } from 'typestyles';
import { getRegisteredComponentRefs } from 'typestyles';
import { styles } from '../runtime';

/**
 * Recipe handles keyed by namespace — re-export from the CSS extract entry so bundlers
 * retain every registered component's CSS (#219).
 */
export const themeableComponents = getRegisteredComponentRefs(styles);

export type { OverrideConfigFor };
