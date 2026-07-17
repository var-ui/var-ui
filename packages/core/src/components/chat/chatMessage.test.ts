import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessage } from './chatMessage';

describe('chatMessage', () => {
  it('registers slots and the sender variant', () => {
    chatMessage({ sender: 'user' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-chat-message');
    expect(css).toContain('.var-ui-chat-message__avatar');
    expect(css).toContain('.var-ui-chat-message__header');
    expect(css).toContain('.var-ui-chat-message__name');
    expect(css).toContain('.var-ui-chat-message__content');
    expect(css).toContain('.var-ui-chat-message__metadata');
    expect(css).toContain('.var-ui-chat-message[data-sender="user"]');
  });
});
