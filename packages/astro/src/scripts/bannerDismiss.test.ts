import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { initDismissibleBanner } from './bannerDismiss';

describe('bannerDismiss', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('removes the banner root when dismiss is clicked', () => {
    document.body.innerHTML = `
      <div data-banner>
        <span>Maintenance Sunday</span>
        <button type="button" data-var-ui-banner-dismiss aria-label="Dismiss"></button>
      </div>
    `;

    initDismissibleBanner();
    document.querySelector<HTMLButtonElement>('[data-var-ui-banner-dismiss]')?.click();

    expect(document.querySelector('[data-banner]')).toBeNull();
  });

  it('does not double-bind dismiss handlers', () => {
    document.body.innerHTML = `
      <div data-banner>
        <button type="button" data-var-ui-banner-dismiss aria-label="Dismiss"></button>
      </div>
    `;

    initDismissibleBanner();
    initDismissibleBanner();
    document.querySelector<HTMLButtonElement>('[data-var-ui-banner-dismiss]')?.click();

    expect(document.querySelector('[data-banner]')).toBeNull();
  });
});
