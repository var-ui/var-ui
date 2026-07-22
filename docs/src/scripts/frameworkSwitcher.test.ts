import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { frameworkCookieWriteValue, initFrameworkSwitcher } from './frameworkSwitcher';
import { FRAMEWORK_COOKIE } from '../lib/framework';

describe('frameworkCookieWriteValue', () => {
  it('builds a cookie assignment for the chosen framework', () => {
    expect(frameworkCookieWriteValue('html')).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(frameworkCookieWriteValue('html')).toMatch(/Path=\//);
    expect(frameworkCookieWriteValue('html')).toMatch(/Max-Age=/);
  });
});

describe('initFrameworkSwitcher', () => {
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

    const reload = vi.fn();
    vi.stubGlobal('location', { reload });

    initFrameworkSwitcher();

    const root = document.querySelector('[data-framework-switcher]');
    expect(root?.hasAttribute('data-framework-switcher-initialized')).toBe(true);

    document.querySelector<HTMLButtonElement>('[data-framework="html"]')?.click();

    expect(document.cookie).toContain(`${FRAMEWORK_COOKIE}=html`);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not double-bind the same root', () => {
    document.body.innerHTML = `
      <div data-framework-switcher>
        <button type="button" data-framework="astro">Astro</button>
      </div>
    `;

    const reload = vi.fn();
    vi.stubGlobal('location', { reload });

    initFrameworkSwitcher();
    initFrameworkSwitcher();

    document.querySelector<HTMLButtonElement>('[data-framework="astro"]')?.click();
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
