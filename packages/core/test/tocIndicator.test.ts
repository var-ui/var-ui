// @vitest-environment jsdom
import { describe, expect, it } from 'vite-plus/test';
import { positionTocIndicator } from '../src/tocIndicator';

describe('positionTocIndicator', () => {
  it('positions the indicator to match the active list item', () => {
    const list = document.createElement('ol');
    const indicator = document.createElement('span');
    indicator.dataset.tocIndicator = '';
    list.append(indicator);

    const item = document.createElement('li');
    item.getBoundingClientRect = () => ({ height: 32 }) as DOMRect;
    Object.defineProperty(item, 'offsetTop', { value: 48, configurable: true });
    Object.defineProperty(item, 'offsetHeight', { value: 32, configurable: true });

    const link = document.createElement('a');
    link.href = '#examples';
    item.append(link);
    list.append(item);

    positionTocIndicator(list, link);

    expect(indicator.style.transform).toBe('translateY(48px)');
    expect(indicator.style.height).toBe('32px');
    expect(indicator.style.opacity).toBe('1');
  });

  it('hides the indicator when there is no active link', () => {
    const list = document.createElement('ol');
    const indicator = document.createElement('span');
    indicator.dataset.tocIndicator = '';
    list.append(indicator);

    positionTocIndicator(list, null);

    expect(indicator.style.opacity).toBe('0');
  });
});
