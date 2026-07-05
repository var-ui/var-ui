import { describe, expect, it } from 'vite-plus/test';
import { isValidElement } from 'react';
import { iconNameList } from '@var-ui/core';
import { bundle1Icons, defaultIcons } from './index';

describe('@var-ui/icons bundle 1', () => {
  it('maps every bundle-1 IconName to a React element', () => {
    for (const name of iconNameList) {
      expect(isValidElement(bundle1Icons[name]), `missing glyph: ${name}`).toBe(true);
    }
  });

  it('defaultIcons includes bundle 1', () => {
    expect(Object.keys(defaultIcons)).toEqual(expect.arrayContaining([...iconNameList]));
  });
});
