import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessage } from './chatMessage';

describe('chatMessage', () => {
  it('registers slots and the sender variant', () => {
    chatMessage({ sender: 'user' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-message-root');
    expect(css).toContain('var-ui-chat-message-avatar');
    expect(css).toContain('var-ui-chat-message-header');
    expect(css).toContain('var-ui-chat-message-name');
    expect(css).toContain('var-ui-chat-message-content');
    expect(css).toContain('var-ui-chat-message-metadata');
    expect(css).toContain('var-ui-chat-message-root-sender-user');
  });
});
