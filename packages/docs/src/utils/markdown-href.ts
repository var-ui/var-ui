import type { VarDocsConfig } from '../config';
import { normalizeDocsPath } from './docs-toc';
import { resolveGuideRouteConfig } from './routing';

export type ResolvedMarkdownViews = {
  enabled: boolean;
  extraPrefixes: string[];
  tagline?: string;
};

export function resolveMarkdownViews(
  markdownViews: VarDocsConfig['markdownViews'] | undefined,
): ResolvedMarkdownViews {
  if (markdownViews === false) {
    return { enabled: false, extraPrefixes: [] };
  }
  if (markdownViews === true || markdownViews == null) {
    return { enabled: true, extraPrefixes: [] };
  }
  const resolved: ResolvedMarkdownViews = {
    enabled: true,
    extraPrefixes: markdownViews.extraPrefixes ?? [],
  };
  if (markdownViews.tagline !== undefined) {
    resolved.tagline = markdownViews.tagline;
  }
  return resolved;
}

export function markdownPrefixes(
  routes: VarDocsConfig['routes'],
  extraPrefixes: readonly string[],
): string[] {
  return [...resolveGuideRouteConfig(routes).map((route) => route.prefix), ...extraPrefixes];
}

export function publicMarkdownRelPath(docsPath: string): string {
  const trimmed = docsPath.replace(/^\//, '');
  if (!trimmed.includes('/')) {
    return `${trimmed}/index.md`;
  }
  return `${trimmed}.md`;
}

export function markdownHref(pathname: string, prefixes: readonly string[]): string | null {
  const path = normalizeDocsPath(pathname);
  const ordered = [...prefixes].sort((a, b) => b.length - a.length);
  for (const prefix of ordered) {
    const normalized = normalizeDocsPath(prefix);
    if (path === normalized || path.startsWith(`${normalized}/`)) {
      return `/${publicMarkdownRelPath(path)}`;
    }
  }
  return null;
}
