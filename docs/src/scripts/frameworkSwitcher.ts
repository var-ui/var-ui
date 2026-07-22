import { FRAMEWORK_COOKIE, type DocsFramework } from '../lib/framework';

const ONE_YEAR = 60 * 60 * 24 * 365;
const ROOT_SELECTOR = '[data-framework-switcher]';
const INITIALIZED_ATTR = 'data-framework-switcher-initialized';

export function frameworkCookieWriteValue(framework: DocsFramework): string {
  return `${FRAMEWORK_COOKIE}=${encodeURIComponent(framework)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function applyFrameworkChoice(framework: DocsFramework): void {
  document.cookie = frameworkCookieWriteValue(framework);
  location.reload();
}

function isDocsFramework(value: string | undefined): value is DocsFramework {
  return value === 'react' || value === 'astro' || value === 'html';
}

/** Bind click handlers on every `[data-framework-switcher]` root (Astro module scripts). */
export function initFrameworkSwitcher(): void {
  document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
    if (!(root instanceof HTMLElement)) return;
    if (root.hasAttribute(INITIALIZED_ATTR)) return;
    root.setAttribute(INITIALIZED_ATTR, '');

    root.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement | null)?.closest('[data-framework]');
      if (!(target instanceof HTMLElement) || !root.contains(target)) return;
      const framework = target.dataset.framework;
      if (isDocsFramework(framework)) applyFrameworkChoice(framework);
    });
  });
}
