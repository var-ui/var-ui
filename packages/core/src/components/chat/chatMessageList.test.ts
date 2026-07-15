import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessageList } from './chatMessageList';

describe('chatMessageList', () => {
  it('registers slots and density variants', () => {
    chatMessageList({ density: 'compact' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-message-list-root');
    expect(css).toContain('var-ui-chat-message-list-inner');
    expect(css).toContain('var-ui-chat-message-list-emptyState');
    expect(css).toContain('var-ui-chat-message-list-inner-density-compact');
  });
});
