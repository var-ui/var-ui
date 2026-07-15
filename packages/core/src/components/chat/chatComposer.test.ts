import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatComposer } from './chatComposer';

describe('chatComposer', () => {
  it('registers all slots', () => {
    chatComposer();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-composer-root');
    expect(css).toContain('var-ui-chat-composer-inputRow');
    expect(css).toContain('var-ui-chat-composer-input');
    expect(css).toContain('var-ui-chat-composer-actions');
  });
});
