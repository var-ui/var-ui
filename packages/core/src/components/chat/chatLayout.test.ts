import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatLayout } from './chatLayout';

describe('chatLayout', () => {
  it('registers root, messageArea, and dock slots', () => {
    chatLayout();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-layout-root');
    expect(css).toContain('var-ui-chat-layout-messageArea');
    expect(css).toContain('var-ui-chat-layout-dock');
  });
});
