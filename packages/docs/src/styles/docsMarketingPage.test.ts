import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { docsMarketingPage } from './docsMarketingPage';

describe('docsMarketingPage CSS', () => {
  it('registers a full-width main without docs TOC grid columns', () => {
    docsMarketingPage();
    const css = getRegisteredCss();

    expect(css).toContain('.var-ui-docs-marketing-page__main');
    expect(css).toMatch(/\.var-ui-docs-marketing-page__main[\s\S]*width: 100%/);
    expect(css).not.toMatch(/\.var-ui-docs-marketing-page__main[\s\S]*grid-template-columns/);
  });
});
