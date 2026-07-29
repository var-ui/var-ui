import { designTokens } from './tokens';
import { atReducedMotion } from './theme-conditions';
import { registerColorSchemeGlobals, typestyles } from './runtime';

/** @internal Re-register after `reset()` in tests. */
export function registerDocumentGlobals(): void {
  typestyles.global.style('html', {
    scrollBehavior: 'smooth',
    ...atReducedMotion({ scrollBehavior: 'auto' }),
  });

  typestyles.global.style('body', {
    margin: 0,
    minHeight: '100%',
    fontFamily: designTokens.fontFamily.sans.var,
    lineHeight: designTokens.lineHeight.normal.var,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    // Resolves correctly when the design theme surface lives on `<html>`
    // (`DesignSystemProvider applyToDocument`). Otherwise these vars fall back to
    // unset/initial until an ancestor defines the theme tokens.
    backgroundColor: designTokens.color.background.app.var,
    color: designTokens.color.text.primary.var,
  });

  // Form controls don't inherit fonts by default (UA styles win), so buttons and
  // inputs would render in the platform font instead of the theme's. Recipes that
  // want a different face (e.g. kbd/code) still override in the components layer.
  typestyles.global.style('button, input, select, textarea', {
    font: 'inherit',
  });
}

/** Re-register all package globals after `reset()` in tests. */
export function registerGlobals(): void {
  registerColorSchemeGlobals();
  registerDocumentGlobals();
}

registerDocumentGlobals();
