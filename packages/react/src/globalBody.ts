import { designTokens, global } from '@var-ui/core';

global.style('body', {
  margin: 0,
  minHeight: '100%',
  fontFamily: designTokens.fontFamily.sans,
  lineHeight: designTokens.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  // Resolves correctly when the design theme surface lives on `<html>`
  // (`DesignSystemProvider applyToDocument`). Otherwise these vars fall back to
  // unset/initial until an ancestor defines the theme tokens.
  backgroundColor: designTokens.color.background.app,
  color: designTokens.color.text.primary,
});

// Form controls don't inherit fonts by default (UA styles win), so buttons and
// inputs would render in the platform font instead of the theme's. Recipes that
// want a different face (e.g. kbd/code) still override in the components layer.
global.style('button, input, select, textarea', {
  font: 'inherit',
});
