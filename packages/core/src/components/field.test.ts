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
    expect(css).toContain('.var-ui-field');
    expect(css).toContain('.var-ui-field__label');
    expect(css).toContain('.var-ui-field__description');
    expect(css).toContain('.var-ui-field__error');
  });

  it('keeps textField public class names stable after fieldChrome refactor', () => {
    textField();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-text-field');
    expect(css).toContain('.var-ui-text-field__label');
    expect(css).toContain('.var-ui-text-field__input');
    expect(css).toContain('.var-ui-text-field__description');
    expect(css).toContain('.var-ui-text-field__error');
  });

  it('keeps textAreaField and select class names stable', () => {
    textAreaField();
    select();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-text-area-field');
    expect(css).toContain('.var-ui-text-area-field__label');
    expect(css).toContain('.var-ui-text-area-field__input');
    expect(css).toContain('.var-ui-text-area-field__description');
    expect(css).toContain('.var-ui-text-area-field__error');
    expect(css).toContain('.var-ui-select');
    expect(css).toContain('.var-ui-select__label');
    expect(css).toContain('.var-ui-select__trigger');
    expect(css).toContain('.var-ui-select__popover');
    expect(css).toContain('.var-ui-select__item');
  });
});
