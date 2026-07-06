import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { kbd } from './kbd';
import { heading, textBlock } from './typography';

describe('typography recipes', () => {
  it('heading registers size variants including display', () => {
    heading({ size: 'display' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-heading-base');
    expect(css).toContain('example-ds-heading-size-display');
  });

  it('textBlock registers size, tone, and weight axes', () => {
    textBlock({ size: 'sm', tone: 'secondary', weight: 'medium' });
    const css = getRegisteredCss();
    expect(css).toContain('example-ds-text-block-size-sm');
    expect(css).toContain('example-ds-text-block-tone-secondary');
    expect(css).toContain('example-ds-text-block-weight-medium');
  });

  it('kbd registers a key-cap base class', () => {
    kbd();
    expect(getRegisteredCss()).toContain('example-ds-kbd-base');
  });
});
