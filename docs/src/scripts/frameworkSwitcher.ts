import { FRAMEWORK_COOKIE, type DocsFramework } from '../lib/framework';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function frameworkCookieWriteValue(framework: DocsFramework): string {
  return `${FRAMEWORK_COOKIE}=${encodeURIComponent(framework)}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

export function applyFrameworkChoice(framework: DocsFramework): void {
  document.cookie = frameworkCookieWriteValue(framework);
  location.reload();
}
