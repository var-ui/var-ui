import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { icon } from '../components/icon';
import { iconNameList } from './iconNames';

describe('icon system (core)', () => {
  it('ships bundle 1 + chat bundle 2 semantic names', () => {
    expect([...iconNameList].sort()).toEqual(
      [
        'check',
        'chevronDown',
        'chevronLeft',
        'chevronRight',
        'close',
        'copy',
        'error',
        'info',
        'search',
        'success',
        'warning',
        'arrowUp',
        'stop',
        'wrench',
        'clock',
        'moreHorizontal',
      ].sort(),
    );
  });

  it('registers size variants and color var', () => {
    icon({ size: 'md' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-icon');
    expect(css).toContain('.var-ui-icon[data-size="md"]');
    expect(css).toMatch(/--var-ui-icon-[\w-]*color/);
  });
});
