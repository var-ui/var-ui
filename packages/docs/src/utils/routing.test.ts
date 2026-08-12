import { describe, expect, it } from 'vite-plus/test';
import { guideInjectPatterns, matchGuideRoute, resolveGuideRouteConfig } from './routing';

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
