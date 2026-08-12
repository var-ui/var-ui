import { describe, expect, it } from 'vite-plus/test';
import { normalizeDocsPath, shouldShowDocsToc } from './docs-toc';

describe('shouldShowDocsToc', () => {
  const sitePrefixes = { guidePrefixes: ['/docs', '/theming'], extraPaths: ['/components'] };

  it('shows on theming and docs article pages', () => {
    expect(shouldShowDocsToc('/theming', sitePrefixes)).toBe(true);
    expect(shouldShowDocsToc('/theming/colors', sitePrefixes)).toBe(true);
    expect(shouldShowDocsToc('/docs/getting-started', sitePrefixes)).toBe(true);
    expect(shouldShowDocsToc('/components', sitePrefixes)).toBe(true);
  });

  it('hides on homepage, playground, and component detail pages', () => {
    expect(shouldShowDocsToc('/', sitePrefixes)).toBe(false);
    expect(shouldShowDocsToc('/playground', sitePrefixes)).toBe(false);
    expect(shouldShowDocsToc('/playground/colors', sitePrefixes)).toBe(false);
    expect(shouldShowDocsToc('/dev/demo-host-smoke', sitePrefixes)).toBe(false);
    expect(shouldShowDocsToc('/components/button', sitePrefixes)).toBe(false);
  });

  it('normalizes trailing slashes', () => {
    expect(shouldShowDocsToc('/theming/', sitePrefixes)).toBe(true);
    expect(normalizeDocsPath('/theming/')).toBe('/theming');
  });
});
