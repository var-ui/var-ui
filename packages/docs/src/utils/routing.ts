import { normalizeDocsPath } from './docs-toc';

export type GuideRoutePrefix = {
  prefix: string;
  collection: string;
};

/** Default guide routes when `varDocs({ routes })` is omitted. */
export const DEFAULT_GUIDE_ROUTES: readonly GuideRoutePrefix[] = [
  { prefix: '/docs', collection: 'docs' },
] as const;

export type ResolvedGuideRoute = {
  collection: string;
  /** Entry id within the collection (e.g. `getting-started`, `index`). */
  id: string;
  /** Normalized pathname without trailing slash. */
  pathname: string;
};

/**
 * Map a request pathname to a content collection + entry id.
 * Returns `null` when the path is outside configured guide prefixes.
 */
export function matchGuideRoute(
  pathname: string,
  routes: readonly GuideRoutePrefix[] = DEFAULT_GUIDE_ROUTES,
): ResolvedGuideRoute | null {
  const path = normalizeDocsPath(pathname);

  // Longer prefixes first so `/docs/api` wins over `/docs` when both exist.
  const ordered = [...routes].sort((a, b) => b.prefix.length - a.prefix.length);

  for (const route of ordered) {
    const prefix = normalizeDocsPath(route.prefix);
    if (path === prefix) {
      return { collection: route.collection, id: 'index', pathname: path };
    }
    if (path.startsWith(`${prefix}/`)) {
      const id = path.slice(prefix.length + 1);
      if (!id || id.includes('..')) return null;
      return { collection: route.collection, id, pathname: path };
    }
  }

  return null;
}

/**
 * Build guide route list from optional free-form user config.
 * Falls back to {@link DEFAULT_GUIDE_ROUTES} when omitted or empty.
 */
export function resolveGuideRouteConfig(
  routes?: Record<string, GuideRoutePrefix> | null,
): GuideRoutePrefix[] {
  if (routes && Object.keys(routes).length > 0) {
    return Object.values(routes);
  }
  return [...DEFAULT_GUIDE_ROUTES];
}

/**
 * Astro `injectRoute` patterns for a URL prefix (`/docs` → `docs`, `docs/[...slug]`).
 */
export function guideInjectPatterns(prefix: string): string[] {
  const segment = normalizeDocsPath(prefix).replace(/^\//, '');
  if (!segment || segment.includes('..') || segment.includes('[')) {
    throw new Error(`Invalid guide route prefix: ${prefix}`);
  }
  return [segment, `${segment}/[...slug]`];
}

/** Injected guide routes prerender only when the Astro app is fully static. */
export function prerenderGuideRoutes(output: string): boolean {
  return output === 'static';
}

/**
 * Strip Astro `base` from a request pathname so guide matching sees `/docs/…`.
 * `import.meta.env.BASE_URL` is `/` or a prefix that ends with `/`.
 */
export function stripAstroBase(pathname: string, base: string): string {
  const normalizedBase = normalizeDocsPath(base);
  if (!normalizedBase || normalizedBase === '/') {
    return pathname;
  }
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const normalizedPath = normalizeDocsPath(path);
  if (normalizedPath === normalizedBase) {
    return '/';
  }
  if (normalizedPath.startsWith(`${normalizedBase}/`)) {
    return normalizedPath.slice(normalizedBase.length);
  }
  return pathname;
}

export const STATIC_MULTI_PREFIX_ERROR =
  "Static injected guide routes require exactly one `routes` prefix. Use `disableGuideRoutes` and your own pages, or set `output: 'server'`.";

/**
 * Static `injectRoute` patterns cannot target more than one prefix in this pass.
 * Call from config setup (when prerendering) and from `getStaticPaths`.
 */
export function assertSingleStaticGuidePrefix(routes: readonly GuideRoutePrefix[]): void {
  if (routes.length !== 1) {
    throw new Error(STATIC_MULTI_PREFIX_ERROR);
  }
}

/**
 * Catch-all `getStaticPaths` entries for a guide collection.
 * Omits `index` so the prefix route (`/docs`) owns that page.
 */
export function guideCatchAllStaticPaths(
  entries: readonly { id: string }[],
): { params: { slug: string } }[] {
  return entries
    .filter((entry) => entry.id !== 'index')
    .map((entry) => ({ params: { slug: entry.id } }));
}
