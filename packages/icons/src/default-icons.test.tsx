import { describe, expect, it } from 'vite-plus/test';
import { isValidElement } from 'react';
import { iconNameList } from '@var-ui/core';
import { defaultIcons } from './default-icons';

describe('@var-ui/icons', () => {
  it('maps every semantic icon name to a React element', () => {
    for (const name of iconNameList) {
      expect(isValidElement(defaultIcons[name]), `missing glyph: ${name}`).toBe(true);
    }
  });
});
