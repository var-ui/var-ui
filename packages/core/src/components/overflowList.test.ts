import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { overflowList } from './overflowList';

describe('overflowList', () => {
  it('registers slots and gap/fillParent variants', () => {
    overflowList({ gap: 'lg', fillParent: true });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-overflow-list');
    expect(css).toContain('.var-ui-overflow-list__item');
    expect(css).toContain('.var-ui-overflow-list__overflow');
    expect(css).toContain('[data-fill-parent]');
  });

  it('themes gap via custom property', () => {
    overflowList();
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-overflow-list-gap');
  });
});
