import { describe, expect, it } from 'vite-plus/test';
import { hiddenClassName } from '@var-ui/core/hidden';
import { recipeProps } from './utils';

describe('Astro Hidden class contract', () => {
  it('recipeProps + hiddenClassName yield a className string', () => {
    const rp = recipeProps(hiddenClassName({ hide: { md: true } }));
    expect(rp.className).toContain('hidden-md-true');
  });
});
