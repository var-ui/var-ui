import { beforeEach, describe, expect, it } from 'vite-plus/test';
import {
  getMobileNavProvider,
  initMobileNav,
  initMobileNavProvider,
  initMobileNavToggle,
} from './mobileNav';

function mountProvider(): HTMLElement {
  const root = document.createElement('div');
  root.dataset.varUiMobileNavProvider = '';
  root.innerHTML = `
    <button type="button" data-var-ui-mobile-nav-toggle aria-label="Open navigation"></button>
    <div data-var-ui-mobile-nav>
      <div data-var-ui-mobile-nav-overlay></div>
      <div data-var-ui-mobile-nav-panel role="dialog" aria-label="Navigation" tabindex="-1">
        <button type="button" data-var-ui-mobile-nav-close aria-label="Close navigation"></button>
        <a href="/docs">Docs</a>
      </div>
    </div>
  `;
  document.body.appendChild(root);
  return root;
}

describe('mobileNav', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('shares open state between toggle and drawer via the provider', () => {
    const root = mountProvider();
    initMobileNavProvider(root);
    initMobileNav(root.querySelector('[data-var-ui-mobile-nav]') as HTMLElement);
    initMobileNavToggle(root.querySelector('[data-var-ui-mobile-nav-toggle]') as HTMLElement);

    const provider = getMobileNavProvider(root);
    const overlay = root.querySelector('[data-var-ui-mobile-nav-overlay]') as HTMLElement;
    const toggle = root.querySelector('[data-var-ui-mobile-nav-toggle]') as HTMLElement;

    expect(provider?.isOpen).toBe(false);
    provider?.open();
    expect(overlay.hasAttribute('data-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    provider?.close();
    expect(overlay.hasAttribute('data-open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when the overlay is clicked', () => {
    const root = mountProvider();
    initMobileNavProvider(root);
    initMobileNav(root.querySelector('[data-var-ui-mobile-nav]') as HTMLElement);

    const provider = getMobileNavProvider(root);
    const overlay = root.querySelector('[data-var-ui-mobile-nav-overlay]') as HTMLElement;

    provider?.open();
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(provider?.isOpen).toBe(false);
  });

  it('locks body scroll while open', () => {
    const root = mountProvider();
    initMobileNavProvider(root);

    const provider = getMobileNavProvider(root);
    provider?.open();
    expect(document.body.style.overflow).toBe('hidden');
    provider?.close();
    expect(document.body.style.overflow).toBe('');
  });
});
