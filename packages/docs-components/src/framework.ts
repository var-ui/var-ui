export type DocsFramework = 'react' | 'astro' | 'html';

export const FRAMEWORK_COOKIE = 'var-ui-framework';

export const DOCS_FRAMEWORKS = [
  'react',
  'astro',
  'html',
] as const satisfies readonly DocsFramework[];

export function parseFrameworkCookie(value: string | undefined | null): DocsFramework {
  if (value === 'react' || value === 'astro' || value === 'html') return value;
  return 'react';
}

export function readFrameworkFromCookieHeader(cookieHeader: string | null): DocsFramework {
  if (!cookieHeader) return 'react';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${FRAMEWORK_COOKIE}=([^;]*)`));
  return parseFrameworkCookie(match?.[1] ? decodeURIComponent(match[1]) : undefined);
}
