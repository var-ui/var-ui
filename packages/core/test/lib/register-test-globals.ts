import { registerColorSchemeGlobals } from '../../src/runtime';
import { registerBaseStyles } from '../../src/theme/base-styles';

/** Re-register package globals after `reset()` in tests. */
export function registerTestGlobals(): void {
  registerColorSchemeGlobals();
  registerBaseStyles();
}
