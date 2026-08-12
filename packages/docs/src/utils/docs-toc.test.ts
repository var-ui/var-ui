import { describe, expect, it } from 'vite-plus/test';
import { normalizeDocsPath, shouldShowDocsToc } from './docs-toc';

describe('shouldShowDocsToc', () => {
  it('shows TOC on configured guide prefixes', () => {
    expect(shouldShowDocsToc('/docs/getting-started')).toBe(true);
    expect(shouldShowDocsToc('/theming/colors', { guidePrefixes: ['/docs', '/theming'] })).toBe(
      true,
    );
    expect(shouldShowDocsToc('/components', { extraPaths: ['/components'] })).toBe(true);
  });

  it('hides TOC on homepage, playground, and component detail pages', () => {
    expect(shouldShowDocsToc('/')).toBe(false);
    expect(shouldShowDocsToc('/playground')).toBe(false);
    expect(shouldShowDocsToc('/playground/colors')).toBe(false);
    expect(shouldShowDocsToc('/dev/demo-host-smoke')).toBe(false);
    expect(shouldShowDocsToc('/components/button')).toBe(false);
    expect(shouldShowDocsToc('/theming')).toBe(false);
  });

  it('normalizes trailing slashes', () => {
    expect(shouldShowDocsToc('/docs/')).toBe(true);
    expect(normalizeDocsPath('/theming/')).toBe('/theming');
  });
});
