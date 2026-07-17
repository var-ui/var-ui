import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { hoverCard } from './hoverCard';

describe('hoverCard', () => {
  it('registers root, title, and content slots', () => {
    hoverCard();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-hover-card');
    expect(css).toContain('.var-ui-hover-card__title');
    expect(css).toContain('.var-ui-hover-card__content');
  });
});
