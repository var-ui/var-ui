import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessageBubble } from './chatMessageBubble';

describe('chatMessageBubble', () => {
  it('registers sender, variant, and group variants', () => {
    chatMessageBubble({ sender: 'user', variant: 'ghost', group: 'first' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-chat-message-bubble');
    expect(css).toContain('.var-ui-chat-message-bubble[data-sender="user"]');
    expect(css).toContain('.var-ui-chat-message-bubble[data-variant="ghost"]');
    expect(css).toContain('.var-ui-chat-message-bubble[data-group="first"]');
  });
});
