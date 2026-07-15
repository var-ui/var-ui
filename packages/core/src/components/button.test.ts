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
    expect(css).toContain('var(--var-ui-color-danger-solid)');
    expect(css).not.toMatch(/var-ui-button-intent-danger[^}]*var\(--var-ui-color-danger-default\)/);
  });
});
