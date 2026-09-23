import { describe, expect, it } from 'vite-plus/test';
import { hiddenClassName } from '@var-ui/core';
import { mergeProps } from './utils';

describe('Astro Hidden class contract', () => {
  it('mergeProps + hiddenClassName yield a className string', () => {
    const rp = mergeProps(hiddenClassName({ hide: { md: true } }));
    expect(rp.className).toContain('hidden-md-true');
  });
});
