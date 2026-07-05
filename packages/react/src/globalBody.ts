import { designTokens, global } from '@var-ui/core';

global.style('body', {
  margin: 0,
  minHeight: '100%',
  fontFamily: designTokens.fontFamily.sans,
  lineHeight: designTokens.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});
