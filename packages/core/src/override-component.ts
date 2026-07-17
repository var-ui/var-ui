import type { ThemeSurface } from 'typestyles';
import { styles } from './runtime';

export type OverrideComponentOptions = {
  /** When set, scopes the override under `.${theme.className}` (descendant prefix). */
  theme?: ThemeSurface;
};

/**
 * Restyle a recipe via `styles.override`, always in the `overrides` cascade layer.
 * Pass `{ theme }` to limit the override to that theme's surface class.
 */
export function overrideComponent(
  component: object,
  config: object,
  options?: OverrideComponentOptions,
): void {
  const selectorPrefix = options?.theme ? `.${options.theme.className}` : undefined;
  // Overload surface is preserved at the styles.override call; config shape is checked there.
  styles.override(component as never, config as never, {
    selectorPrefix,
    layer: 'overrides',
  });
}
