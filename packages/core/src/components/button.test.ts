import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { button } from './button';

describe('button', () => {
  it('registers intent variants including danger', () => {
    button({ intent: 'primary' });
    button({ intent: 'danger' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-button-intent-primary');
    expect(css).toContain('var-ui-button-intent-danger');
  });
});
