// @vitest-environment jsdom
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { tabs } from '../src/components/tabs';
import { positionTabsIndicator, tabsIndicatorCssVars } from '../src/tabsIndicator';

describe('positionTabsIndicator', () => {
  it('uses CSS var names that match the tabs recipe', () => {
    tabs();
    const css = getRegisteredCss();
    for (const name of Object.values(tabsIndicatorCssVars)) {
      expect(css).toContain(name);
    }
  });

  it('positions the indicator to match the active tab', () => {
    const list = document.createElement('div');

    const tab = document.createElement('button');
    tab.setAttribute('role', 'tab');
    Object.defineProperty(tab, 'offsetLeft', { value: 24, configurable: true });
    Object.defineProperty(tab, 'offsetWidth', { value: 80, configurable: true });
    list.append(tab);

    positionTabsIndicator(list, tab);

    expect(list.style.getPropertyValue(tabsIndicatorCssVars.x)).toBe('24px');
    expect(list.style.getPropertyValue(tabsIndicatorCssVars.width)).toBe('80px');
    expect(list.style.getPropertyValue(tabsIndicatorCssVars.opacity)).toBe('1');
  });

  it('hides the indicator when there is no active tab', () => {
    const list = document.createElement('div');

    positionTabsIndicator(list, null);

    expect(list.style.getPropertyValue(tabsIndicatorCssVars.opacity)).toBe('0');
  });
});
