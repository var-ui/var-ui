import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { hoverCard } from './hoverCard';

describe('hoverCard', () => {
  it('registers root, title, and content slots', () => {
    hoverCard();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-hover-card-root');
    expect(css).toContain('var-ui-hover-card-title');
    expect(css).toContain('var-ui-hover-card-content');
  });
});
