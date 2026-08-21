import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { colorPicker } from '../../src/components/colorPicker';

describe('colorPicker', () => {
  it('registers thumbShadow as an untyped @property with a placeholder initial', () => {
    colorPicker();
    const css = getRegisteredCss();
    expect(css).toContain(
      '@property --var-ui-color-picker-thumbshadow { syntax: "*"; inherits: true; initial-value: none;',
    );
  });
});
