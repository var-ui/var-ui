import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { kbd } from './kbd';
import { heading, textBlock } from './typography';

describe('typography recipes', () => {
  it('heading registers size variants including display', () => {
    heading({ size: 'display' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-heading');
    expect(css).toContain('.var-ui-heading[data-size="display"]');
  });

  it('textBlock registers size, tone, and weight axes', () => {
    textBlock({ size: 'sm', tone: 'secondary', weight: 'medium' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-text-block[data-size="sm"]');
    expect(css).toContain('.var-ui-text-block[data-tone="secondary"]');
    expect(css).toContain('.var-ui-text-block[data-weight="medium"]');
  });

  it('kbd registers a key-cap base class', () => {
    kbd();
    expect(getRegisteredCss()).toContain('.var-ui-kbd');
  });
});
