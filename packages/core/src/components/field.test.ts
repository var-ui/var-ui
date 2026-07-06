import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { field } from './field';
import { select } from './select';
import { textAreaField } from './textAreaField';
import { textField } from './textField';

describe('field recipe', () => {
  it('registers root/label/description/error slots', () => {
    field();
    const css = getRegisteredCss();
    for (const slot of ['root', 'label', 'description', 'error']) {
      expect(css).toContain(`example-ds-field-${slot}`);
    }
  });

  it('keeps textField public class names stable after fieldChrome refactor', () => {
    textField();
    const css = getRegisteredCss();
    for (const slot of ['root', 'label', 'input', 'description', 'error']) {
      expect(css).toContain(`example-ds-text-field-${slot}`);
    }
  });

  it('keeps textAreaField and select class names stable', () => {
    textAreaField();
    select();
    const css = getRegisteredCss();
    for (const slot of ['root', 'label', 'input', 'description', 'error']) {
      expect(css).toContain(`example-ds-text-area-field-${slot}`);
    }
    for (const slot of ['root', 'label', 'trigger', 'popover', 'item']) {
      expect(css).toContain(`example-ds-select-${slot}`);
    }
  });
});
