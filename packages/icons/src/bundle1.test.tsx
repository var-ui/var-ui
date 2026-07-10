import { describe, expect, it } from 'vite-plus/test';
import { isValidElement } from 'react';
import { bundle1Icons, defaultIcons } from './index';

const BUNDLE_1_NAMES = [
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
] as const;

describe('@var-ui/icons bundle 1', () => {
  it('maps every bundle-1 name to a React element', () => {
    for (const name of BUNDLE_1_NAMES) {
      expect(isValidElement(bundle1Icons[name]), `missing glyph: ${name}`).toBe(true);
    }
  });

  it('defaultIcons includes bundle 1', () => {
    expect(Object.keys(defaultIcons)).toEqual(expect.arrayContaining([...BUNDLE_1_NAMES]));
  });
});
