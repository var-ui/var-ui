import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatSystemMessage } from './chatSystemMessage';

describe('chatSystemMessage', () => {
  it('registers slots and tone variants', () => {
    chatSystemMessage({ tone: 'success' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-system-message-root');
    expect(css).toContain('var-ui-chat-system-message-icon');
    expect(css).toContain('var-ui-chat-system-message-text');
    expect(css).toContain('var-ui-chat-system-message-root-tone-success');
  });
});
