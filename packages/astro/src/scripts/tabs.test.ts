import { beforeEach, describe, expect, it } from 'vite-plus/test';
import { createTabsController } from './tabs';

function mountTabs(): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = `
    <div data-var-ui-tabs>
      <div role="tablist">
        <button type="button" role="tab" id="tab-a" aria-controls="panel-a" aria-selected="true" tabindex="0">A</button>
        <button type="button" role="tab" id="tab-b" aria-controls="panel-b" aria-selected="false" tabindex="-1">B</button>
        <button type="button" role="tab" id="tab-c" aria-controls="panel-c" aria-selected="false" tabindex="-1">C</button>
      </div>
      <div role="tabpanel" id="panel-a" aria-labelledby="tab-a"></div>
      <div role="tabpanel" id="panel-b" aria-labelledby="tab-b" hidden></div>
      <div role="tabpanel" id="panel-c" aria-labelledby="tab-c" hidden></div>
    </div>
  `;
  document.body.appendChild(root);
  return root.querySelector('[data-var-ui-tabs]') as HTMLElement;
}

describe('createTabsController', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('selects the clicked tab and toggles hidden', () => {
    const el = mountTabs();
    createTabsController(el);
    const tabB = el.querySelector('#tab-b') as HTMLButtonElement;
    tabB.click();
    expect(tabB.getAttribute('aria-selected')).toBe('true');
    expect(el.querySelector('#panel-b')?.hasAttribute('hidden')).toBe(false);
    expect(el.querySelector('#panel-a')?.hasAttribute('hidden')).toBe(true);
  });

  it('updates tabindex and data-selected when selecting a tab', () => {
    const el = mountTabs();
    createTabsController(el);
    const tabA = el.querySelector('#tab-a') as HTMLButtonElement;
    const tabB = el.querySelector('#tab-b') as HTMLButtonElement;

    tabB.click();

    expect(tabA.tabIndex).toBe(-1);
    expect(tabB.tabIndex).toBe(0);
    expect(tabB.hasAttribute('data-selected')).toBe(true);
    expect(tabA.hasAttribute('data-selected')).toBe(false);
  });

  it('moves selection with ArrowRight and ArrowLeft', () => {
    const el = mountTabs();
    createTabsController(el);
    const tabA = el.querySelector('#tab-a') as HTMLButtonElement;
    const tabB = el.querySelector('#tab-b') as HTMLButtonElement;

    tabA.focus();
    tabA.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabB.getAttribute('aria-selected')).toBe('true');
    expect(el.querySelector('#panel-b')?.hasAttribute('hidden')).toBe(false);

    tabB.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(tabA.getAttribute('aria-selected')).toBe('true');
    expect(el.querySelector('#panel-a')?.hasAttribute('hidden')).toBe(false);
  });

  it('selects first and last tabs with Home and End', () => {
    const el = mountTabs();
    createTabsController(el);
    const tabA = el.querySelector('#tab-a') as HTMLButtonElement;
    const tabC = el.querySelector('#tab-c') as HTMLButtonElement;

    tabA.focus();
    tabA.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabC.getAttribute('aria-selected')).toBe('true');

    tabC.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(tabA.getAttribute('aria-selected')).toBe('true');
  });

  it('does not double-bind handlers', () => {
    const el = mountTabs();
    createTabsController(el);
    createTabsController(el);
    const tabB = el.querySelector('#tab-b') as HTMLButtonElement;
    tabB.click();
    expect(tabB.getAttribute('aria-selected')).toBe('true');
  });
});
