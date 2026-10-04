import { defaultThemeClassName } from '@var-ui/core';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { applyDocsThemePickerSelection, initDocsThemePicker } from './docsThemePicker';

const PRESETS = [
  {
    id: 'default',
    label: 'Default',
    className: defaultThemeClassName,
    swatch: '#64748b',
    lazyCss: false,
  },
  {
    id: 'forest',
    label: 'Forest',
    className: 'theme-forest',
    swatch: '#16a34a',
    lazyCss: false,
  },
];

function mountPicker(storageKey = 'docs-theme-id'): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div
      data-docs-theme-picker
      data-presets='${JSON.stringify(PRESETS)}'
      data-storage-key="${storageKey}"
      data-fallback-class="${defaultThemeClassName}"
    >
      <button type="button" data-docs-theme-picker-trigger aria-expanded="false">
        <svg viewBox="0 0 24 24">
          <rect data-docs-theme-picker-swatch fill="#64748b"></rect>
        </svg>
      </button>
      <div data-docs-theme-picker-menu hidden>
        <div role="menu">
          <button type="button" role="menuitemradio" data-theme-id="default" aria-checked="false">
            <span data-docs-theme-picker-check>✓</span>
            Default
          </button>
          <button type="button" role="menuitemradio" data-theme-id="forest" aria-checked="false">
            <span data-docs-theme-picker-check>✓</span>
            Forest
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(host);
  return host.querySelector('[data-docs-theme-picker]') as HTMLElement;
}

function item(root: HTMLElement, id: string): HTMLButtonElement {
  return root.querySelector(`[data-theme-id="${id}"]`) as HTMLButtonElement;
}

describe('applyDocsThemePickerSelection', () => {
  it('updates the trigger swatch and selected option', () => {
    const root = mountPicker();

    applyDocsThemePickerSelection(root, PRESETS, 'forest');

    expect(root.querySelector('[data-docs-theme-picker-swatch]')?.getAttribute('fill')).toBe(
      '#16a34a',
    );
    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'default').getAttribute('aria-checked')).toBe('false');
  });
});

describe('initDocsThemePicker', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    document.documentElement.className = defaultThemeClassName;
  });

  it('marks the stored theme as selected on init', () => {
    localStorage.setItem('docs-theme-id', 'forest');
    const root = mountPicker();
    initDocsThemePicker(root);

    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
    expect(item(root, 'default').getAttribute('aria-checked')).toBe('false');
  });

  it('persists and applies a theme when an item is chosen', () => {
    const root = mountPicker();
    initDocsThemePicker(root);

    item(root, 'forest').click();

    expect(localStorage.getItem('docs-theme-id')).toBe('forest');
    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
    expect(document.documentElement.classList.contains('theme-forest')).toBe(true);
  });

  it('opens and closes the menu from the trigger', () => {
    const root = mountPicker();
    initDocsThemePicker(root);
    const trigger = root.querySelector('[data-docs-theme-picker-trigger]') as HTMLButtonElement;
    const menu = root.querySelector('[data-docs-theme-picker-menu]') as HTMLElement;

    trigger.click();
    expect(menu.hidden).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.click();
    expect(menu.hidden).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu after selecting a theme', () => {
    const root = mountPicker();
    initDocsThemePicker(root);
    const trigger = root.querySelector('[data-docs-theme-picker-trigger]') as HTMLButtonElement;
    const menu = root.querySelector('[data-docs-theme-picker-menu]') as HTMLElement;

    trigger.click();
    item(root, 'forest').click();

    expect(menu.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('syncs selection when storage changes in another tab', () => {
    const root = mountPicker();
    initDocsThemePicker(root);

    localStorage.setItem('docs-theme-id', 'forest');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'docs-theme-id',
        newValue: 'forest',
      }),
    );

    expect(item(root, 'forest').getAttribute('aria-checked')).toBe('true');
  });

  it('moves focus with arrow keys while the menu is open', () => {
    const root = mountPicker();
    initDocsThemePicker(root);
    const trigger = root.querySelector('[data-docs-theme-picker-trigger]') as HTMLButtonElement;

    trigger.click();
    item(root, 'default').focus();
    item(root, 'default').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );

    expect(document.activeElement).toBe(item(root, 'forest'));
  });

  it('ignores duplicate initialization', () => {
    const root = mountPicker();
    const addSpy = vi.spyOn(window, 'addEventListener');

    initDocsThemePicker(root);
    const storageListeners = addSpy.mock.calls.filter(([type]) => type === 'storage').length;
    initDocsThemePicker(root);

    expect(addSpy.mock.calls.filter(([type]) => type === 'storage').length).toBe(storageListeners);
  });
});
