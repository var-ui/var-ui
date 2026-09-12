import { describe, expect, it } from 'vite-plus/test';
import {
  assertSingleStaticGuidePrefix,
  guideCatchAllStaticPaths,
  guideInjectPatterns,
  matchGuideRoute,
  prerenderGuideRoutes,
  resolveGuideRouteConfig,
  stripAstroBase,
} from './routing';

describe('matchGuideRoute', () => {
  it('maps /docs and /docs/* to the docs collection', () => {
    expect(matchGuideRoute('/docs')).toEqual({
      collection: 'docs',
      id: 'index',
      pathname: '/docs',
    });
    expect(matchGuideRoute('/docs/getting-started')).toEqual({
      collection: 'docs',
      id: 'getting-started',
      pathname: '/docs/getting-started',
    });
    expect(matchGuideRoute('/docs/')).toEqual({
      collection: 'docs',
      id: 'index',
      pathname: '/docs',
    });
  });

  it('maps custom prefixes from the route list', () => {
    const routes = [
      { prefix: '/docs', collection: 'docs' },
      { prefix: '/theming', collection: 'theming' },
    ];
    expect(matchGuideRoute('/theming', routes)).toEqual({
      collection: 'theming',
      id: 'index',
      pathname: '/theming',
    });
    expect(matchGuideRoute('/theming/colors', routes)).toEqual({
      collection: 'theming',
      id: 'colors',
      pathname: '/theming/colors',
    });
  });

  it('prefers longer prefixes when overlapping', () => {
    const routes = [
      { prefix: '/docs', collection: 'docs' },
      { prefix: '/docs/api', collection: 'api' },
    ];
    expect(matchGuideRoute('/docs/api/foo', routes)).toEqual({
      collection: 'api',
      id: 'foo',
      pathname: '/docs/api/foo',
    });
  });

  it('returns null outside guide prefixes', () => {
    expect(matchGuideRoute('/')).toBeNull();
    expect(matchGuideRoute('/components/button')).toBeNull();
    expect(matchGuideRoute('/playground')).toBeNull();
    expect(matchGuideRoute('/theming')).toBeNull();
  });
});

describe('resolveGuideRouteConfig', () => {
  it('defaults to /docs only', () => {
    expect(resolveGuideRouteConfig()).toEqual([{ prefix: '/docs', collection: 'docs' }]);
  });

  it('returns free-form route values', () => {
    expect(
      resolveGuideRouteConfig({
        guides: { prefix: '/guides', collection: 'guides' },
        api: { prefix: '/api', collection: 'api' },
      }),
    ).toEqual([
      { prefix: '/guides', collection: 'guides' },
      { prefix: '/api', collection: 'api' },
    ]);
  });

  it('ignores empty route maps', () => {
    expect(resolveGuideRouteConfig({})).toEqual([{ prefix: '/docs', collection: 'docs' }]);
  });
});

describe('guideInjectPatterns', () => {
  it('builds index + catch-all patterns', () => {
    expect(guideInjectPatterns('/docs')).toEqual(['docs', 'docs/[...slug]']);
    expect(guideInjectPatterns('/theming')).toEqual(['theming', 'theming/[...slug]']);
  });
});

describe('stripAstroBase', () => {
  it('leaves pathnames unchanged when the site is at the domain root', () => {
    expect(stripAstroBase('/docs/getting-started', '/')).toBe('/docs/getting-started');
    expect(stripAstroBase('/docs/getting-started/', '/')).toBe('/docs/getting-started/');
  });

  it('strips Astro `base` so guide matching sees the configured prefix', () => {
    expect(stripAstroBase('/foo/docs/getting-started', '/foo/')).toBe('/docs/getting-started');
    expect(stripAstroBase('/foo/docs', '/foo/')).toBe('/docs');
    expect(stripAstroBase('/docs-site/docs/api/client', '/docs-site/')).toBe('/docs/api/client');
  });

  it('maps the base path itself to `/`', () => {
    expect(stripAstroBase('/foo', '/foo/')).toBe('/');
    expect(stripAstroBase('/foo/', '/foo/')).toBe('/');
  });
});

describe('guideCatchAllStaticPaths', () => {
  it('drops the index entry so the prefix route owns /docs', () => {
    expect(guideCatchAllStaticPaths([{ id: 'index' }, { id: 'getting-started' }])).toEqual([
      { params: { slug: 'getting-started' } },
    ]);
  });

  it('emits a catch-all slug for a top-level guide id', () => {
    expect(guideCatchAllStaticPaths([{ id: 'getting-started' }])).toEqual([
      { params: { slug: 'getting-started' } },
    ]);
  });

  it('passes nested collection ids through as the slug string', () => {
    expect(guideCatchAllStaticPaths([{ id: 'api/client' }])).toEqual([
      { params: { slug: 'api/client' } },
    ]);
  });

  it('emits no catch-all paths for an empty or index-only collection', () => {
    expect(guideCatchAllStaticPaths([])).toEqual([]);
    expect(guideCatchAllStaticPaths([{ id: 'index' }])).toEqual([]);
  });
});

describe('prerenderGuideRoutes', () => {
  it('prerenders injected guides only for static output', () => {
    expect(prerenderGuideRoutes('static')).toBe(true);
    expect(prerenderGuideRoutes('server')).toBe(false);
    expect(prerenderGuideRoutes('hybrid')).toBe(false);
  });
});

describe('assertSingleStaticGuidePrefix', () => {
  it('allows a single prefix', () => {
    expect(() =>
      assertSingleStaticGuidePrefix([{ prefix: '/docs', collection: 'docs' }]),
    ).not.toThrow();
  });

  it('throws when no prefixes are provided', () => {
    expect(() => assertSingleStaticGuidePrefix([])).toThrow(
      /exactly one `routes` prefix[\s\S]*disableGuideRoutes[\s\S]*output: 'server'/,
    );
  });

  it('throws when static sites declare more than one prefix', () => {
    expect(() =>
      assertSingleStaticGuidePrefix([
        { prefix: '/docs', collection: 'docs' },
        { prefix: '/theming', collection: 'theming' },
      ]),
    ).toThrow(/exactly one `routes` prefix[\s\S]*disableGuideRoutes[\s\S]*output: 'server'/);
  });
});
