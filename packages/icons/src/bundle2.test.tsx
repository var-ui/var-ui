import { describe, expect, it } from 'vite-plus/test';
import { isValidElement } from 'react';
import { bundle2Icons } from './bundle2';
import { defaultIcons } from './index';

const BUNDLE_2_NAMES = ['arrowUp', 'stop', 'wrench', 'clock'] as const;

describe('@var-ui/icons bundle 2 (chat)', () => {
  it('maps every bundle-2 name to a React element', () => {
    for (const name of BUNDLE_2_NAMES) {
      expect(isValidElement(bundle2Icons[name]), `missing glyph: ${name}`).toBe(true);
    }
  });

  it('defaultIcons includes bundle 2', () => {
    expect(Object.keys(defaultIcons)).toEqual(expect.arrayContaining([...BUNDLE_2_NAMES]));
  });
});
