import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { descriptionList } from './descriptionList';

describe('descriptionList', () => {
  it('registers slots and columns/labelPosition variants', () => {
    descriptionList({ columns: 'multi', labelPosition: 'top' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-description-list');
    expect(css).toContain('.var-ui-description-list__title');
    expect(css).toContain('.var-ui-description-list__item');
    expect(css).toContain('.var-ui-description-list__term');
    expect(css).toContain('.var-ui-description-list__details');
    expect(css).toContain('.var-ui-description-list__toggle');
    expect(css).toContain('[data-columns="multi"]');
    expect(css).toContain('[data-label-position="top"]');
  });

  it('themes term/details colors, gap, term width, and columns via custom properties', () => {
    descriptionList();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-description-list-termcolor');
    expect(css).toContain('--var-ui-description-list-detailscolor');
    expect(css).toContain('--var-ui-description-list-gap');
    expect(css).toContain('--var-ui-description-list-termwidth');
    expect(css).toContain('--var-ui-description-list-columns');
  });
});
