import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { icon } from '../components/icon';
import { iconNameList } from './iconNames';

describe('icon system (core)', () => {
  it('ships the bundle 1 semantic names', () => {
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
      ].sort(),
    );
  });

  it('registers size variants and color var', () => {
    icon({ size: 'md' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-icon-base');
    expect(css).toContain('example-ds-icon-size-md');
    expect(css).toMatch(/--example-ds-icon-[\w-]*color/);
  });
});
