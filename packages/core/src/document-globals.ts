import { registerColorSchemeGlobals } from './runtime';
import { registerBaseStyles } from './base-styles';

/** @internal Re-register after `reset()` in tests. Alias of {@link registerBaseStyles}. */
export function registerDocumentGlobals(): void {
  registerBaseStyles();
}

/** Re-register all package globals after `reset()` in tests. */
export function registerGlobals(): void {
  registerColorSchemeGlobals();
  registerBaseStyles();
}
