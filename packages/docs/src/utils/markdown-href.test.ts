import { describe, expect, it } from 'vite-plus/test';
import {
  markdownHref,
  markdownPrefixes,
  publicMarkdownRelPath,
  resolveMarkdownViews,
} from './markdown-href';

describe('resolveMarkdownViews', () => {
  it('enables views when omitted or true', () => {
    expect(resolveMarkdownViews(undefined)).toEqual({ enabled: true, extraPrefixes: [] });
    expect(resolveMarkdownViews(true)).toEqual({ enabled: true, extraPrefixes: [] });
  });

  it('disables views when false', () => {
    expect(resolveMarkdownViews(false)).toEqual({ enabled: false, extraPrefixes: [] });
  });

  it('enables views from the object form', () => {
    expect(
      resolveMarkdownViews({
        extraPrefixes: ['/components'],
        tagline: 'Agent-readable Var UI docs',
      }),
    ).toEqual({
      enabled: true,
      extraPrefixes: ['/components'],
      tagline: 'Agent-readable Var UI docs',
    });
  });
});

describe('markdownPrefixes', () => {
  it('defaults omitted routes to /docs and appends extraPrefixes', () => {
    expect(markdownPrefixes(undefined, ['/components'])).toEqual(['/docs', '/components']);
  });
});

describe('publicMarkdownRelPath', () => {
  it('maps prefix-only paths to index.md and children to sibling .md', () => {
    expect(publicMarkdownRelPath('/docs')).toBe('docs/index.md');
    expect(publicMarkdownRelPath('/docs/getting-started')).toBe('docs/getting-started.md');
    expect(publicMarkdownRelPath('/components/button')).toBe('components/button.md');
  });
});

describe('markdownHref', () => {
  const prefixes = ['/docs', '/theming', '/components'];

  it('maps matching prefixes to sibling markdown URLs', () => {
    expect(markdownHref('/docs', prefixes)).toBe('/docs/index.md');
    expect(markdownHref('/docs/getting-started', prefixes)).toBe('/docs/getting-started.md');
    expect(markdownHref('/components/button', prefixes)).toBe('/components/button.md');
    expect(markdownHref('/playground', prefixes)).toBeNull();
    expect(markdownHref('/', prefixes)).toBeNull();
  });

  it('matches the longest prefix first', () => {
    expect(markdownHref('/docs-extra/guide', ['/docs', '/docs-extra'])).toBe(
      '/docs-extra/guide.md',
    );
  });
});
