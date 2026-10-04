import { describe, expect, it } from 'vite-plus/test';
import { mergeProps } from 'typestyles';
import { toc } from '../src/components/toc';

describe('toc slot class names', () => {
  it('mergeProps resolves link and item classes (slots may be string-coercible)', () => {
    const s = toc();
    expect(mergeProps(s.link).className).toMatch(/var-ui-toc__link/);
    expect(mergeProps(s.item).className).toMatch(/var-ui-toc__item/);
    expect(String(s.link)).toBe(mergeProps(s.link).className);
  });
});
