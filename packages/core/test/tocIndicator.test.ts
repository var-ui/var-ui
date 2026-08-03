// @vitest-environment jsdom
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { toc } from '../src/components/toc';
import { positionTocIndicator, tocIndicatorCssVars } from '../src/tocIndicator';

describe('positionTocIndicator', () => {
  it('uses CSS var names that match the toc recipe', () => {
    toc();
    const css = getRegisteredCss();
    for (const name of Object.values(tocIndicatorCssVars)) {
      expect(css).toContain(name);
    }
  });

  it('positions the indicator to match the active list item', () => {
    const list = document.createElement('ol');

    const item = document.createElement('li');
    item.getBoundingClientRect = () => ({ height: 32 }) as DOMRect;
    Object.defineProperty(item, 'offsetTop', { value: 48, configurable: true });
    Object.defineProperty(item, 'offsetHeight', { value: 32, configurable: true });

    const link = document.createElement('a');
    link.href = '#examples';
    item.append(link);
    list.append(item);

    positionTocIndicator(list, link);

    expect(list.style.getPropertyValue(tocIndicatorCssVars.y)).toBe('48px');
    expect(list.style.getPropertyValue(tocIndicatorCssVars.height)).toBe('32px');
    expect(list.style.getPropertyValue(tocIndicatorCssVars.opacity)).toBe('1');
  });

  it('hides the indicator when there is no active link', () => {
    const list = document.createElement('ol');

    positionTocIndicator(list, null);

    expect(list.style.getPropertyValue(tocIndicatorCssVars.opacity)).toBe('0');
  });
});
