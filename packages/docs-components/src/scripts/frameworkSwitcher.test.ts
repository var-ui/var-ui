import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  frameworkCookieWriteValue,
  initFrameworkSwitcher,
  selectFrameworkInSwitcher,
} from './frameworkSwitcher';
import { FRAMEWORK_COOKIE } from '../framework';

class ResizeObserverMock {
  observe(): void {}
  disconnect(): void {}
}

describe('frameworkCookieWriteValue', () => {
  it('builds a cookie assignment for the chosen framework', () => {
    expect(frameworkCookieWriteValue('html')).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(frameworkCookieWriteValue('html')).toMatch(/Path=\//);
    expect(frameworkCookieWriteValue('html')).toMatch(/Max-Age=/);
  });
});

describe('selectFrameworkInSwitcher', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('updates selection and cookie', () => {
    document.body.innerHTML = `
      <div data-framework-switcher>
        <button type="button" data-framework="react" data-selected aria-pressed="true">React</button>
        <button type="button" data-framework="html" aria-pressed="false">HTML</button>
      </div>
    `;

    const root = document.querySelector<HTMLElement>('[data-framework-switcher]')!;

    selectFrameworkInSwitcher(root, 'html');

    expect(document.cookie).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(document.documentElement.dataset.framework).toBe('html');
    expect(root.querySelector('[data-framework="html"]')?.hasAttribute('data-selected')).toBe(true);
    expect(root.querySelector('[data-framework="react"]')?.hasAttribute('data-selected')).toBe(
      false,
    );
  });

  it('is a no-op when the framework is already selected', () => {
    document.body.innerHTML = `
      <div data-framework-switcher>
        <button type="button" data-framework="react" data-selected aria-pressed="true">React</button>
      </div>
    `;

    const root = document.querySelector<HTMLElement>('[data-framework-switcher]')!;
    const cookieBefore = document.cookie;

    selectFrameworkInSwitcher(root, 'react');

    expect(document.cookie).toBe(cookieBefore);
  });
});

describe('initFrameworkSwitcher', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('binds clicks on [data-framework-switcher] roots via querySelectorAll', () => {
    document.body.innerHTML = `
      <div data-framework-switcher>
        <button type="button" data-framework="html">HTML</button>
      </div>
    `;

    initFrameworkSwitcher();

    const root = document.querySelector('[data-framework-switcher]');
    expect(root?.hasAttribute('data-framework-switcher-initialized')).toBe(true);

    document.querySelector<HTMLButtonElement>('[data-framework="html"]')?.click();

    expect(document.cookie).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(document.documentElement.dataset.framework).toBe('html');
  });

  it('does not double-bind the same root', () => {
    document.body.innerHTML = `
      <div data-framework-switcher>
        <button type="button" data-framework="astro">Astro</button>
      </div>
    `;

    initFrameworkSwitcher();
    initFrameworkSwitcher();

    document.querySelector<HTMLButtonElement>('[data-framework="astro"]')?.click();
    expect(document.cookie).toContain(`${FRAMEWORK_COOKIE}=astro`);
  });
});
