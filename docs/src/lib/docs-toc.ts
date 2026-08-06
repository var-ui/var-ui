export const DOCS_TOC_CONTENT_SELECTOR = '.docs-article';
export const DOCS_TOC_HEADING_SELECTOR = 'h2[id], h3[id]';

export function normalizeDocsPath(path: string): string {
  return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
}

/** Whether the standard docs TOC should render in BaseLayout for this path. */
export function shouldShowDocsToc(path: string): boolean {
  const normalized = normalizeDocsPath(path);

  if (normalized === '/') return false;
  if (normalized.startsWith('/playground')) return false;
  if (normalized.startsWith('/dev')) return false;
  // Component detail pages render TOC inside ComponentDocTabs.
  if (normalized.startsWith('/components/')) return false;

  return (
    normalized.startsWith('/theming') ||
    normalized.startsWith('/docs') ||
    normalized === '/components'
  );
}
