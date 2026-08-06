import { describe, expect, it } from 'vite-plus/test';
import { normalizeDocsPath, shouldShowDocsToc } from './docs-toc';

describe('shouldShowDocsToc', () => {
  it('shows on theming and docs article pages', () => {
    expect(shouldShowDocsToc('/theming')).toBe(true);
    expect(shouldShowDocsToc('/theming/colors')).toBe(true);
    expect(shouldShowDocsToc('/docs/getting-started')).toBe(true);
    expect(shouldShowDocsToc('/components')).toBe(true);
  });

  it('hides on homepage, playground, dev, and component detail pages', () => {
    expect(shouldShowDocsToc('/')).toBe(false);
    expect(shouldShowDocsToc('/playground')).toBe(false);
    expect(shouldShowDocsToc('/playground/colors')).toBe(false);
    expect(shouldShowDocsToc('/dev/demo-host-smoke')).toBe(false);
    expect(shouldShowDocsToc('/components/button')).toBe(false);
  });

  it('normalizes trailing slashes', () => {
    expect(shouldShowDocsToc('/theming/')).toBe(true);
    expect(normalizeDocsPath('/theming/')).toBe('/theming');
  });
});
