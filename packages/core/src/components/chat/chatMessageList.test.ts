import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessageList } from './chatMessageList';

describe('chatMessageList', () => {
  it('registers slots and density variants', () => {
    chatMessageList({ density: 'compact' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-chat-message-list');
    expect(css).toContain('.var-ui-chat-message-list__inner');
    expect(css).toContain('.var-ui-chat-message-list__emptyState');
    expect(css).toContain('.var-ui-chat-message-list__inner[data-density="compact"]');
  });
});
