import { designTokens, global } from '@var-ui/core';

global.style('body', {
  margin: 0,
  minHeight: '100%',
  fontFamily: designTokens.fontFamily.sans,
  lineHeight: designTokens.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

// Form controls don't inherit fonts by default (UA styles win), so buttons and
// inputs would render in the platform font instead of the theme's. Recipes that
// want a different face (e.g. kbd/code) still override in the components layer.
global.style('button, input, select, textarea', {
  font: 'inherit',
});
