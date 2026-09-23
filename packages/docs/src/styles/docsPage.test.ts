import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { styles } from '@var-ui/core';
import { docsPage, docsPageContent } from './docsPage';

describe('docsPage CSS', () => {
  it('registers layout grid, prose column, and collapses TOC below lg', () => {
    docsPage();
    const css = getRegisteredCss();
    const belowLg = styles.breakpoint('lg', 'max');

    expect(css).toContain('grid-template-columns');
    expect(css).toContain('13.75rem');
    expect(css).toContain('60rem');
    expect(css).toContain(belowLg);
    expect(css).toContain('.docs-page-toc-nav');
    expect(css).toContain('body.docs-body');
    expect(css).toContain('#var-ui-app-shell-main');
    expect(css).toContain('--var-ui-docs-page-headerheight');
    expect(css).toContain('var(--var-ui-size-nav-bar)');
  });

  it('defaults content variants when called with no options', () => {
    const content = docsPageContent();

    expect(content.attrs['data-content-width']).toBe('default');
    expect(content.attrs['data-content-placement']).toBe('standalone');
  });

  it('applies full-width and in-page-body content variants via data attributes', () => {
    const standalone = docsPageContent({ width: 'default', placement: 'standalone' });
    const inBody = docsPageContent({ width: 'full', placement: 'inPageBody' });

    expect(standalone.attrs['data-content-placement']).toBe('standalone');
    expect(inBody.attrs['data-content-width']).toBe('full');
    expect(inBody.attrs['data-content-placement']).toBe('inPageBody');
  });
});
