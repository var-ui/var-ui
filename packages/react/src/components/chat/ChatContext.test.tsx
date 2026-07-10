import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import {
  ChatListContext,
  ChatMessageContext,
  useChatListContext,
  useChatMessageContext,
} from './ChatContext';

function ListConsumer() {
  const ctx = useChatListContext();
  return <span>{ctx ? ctx.density : 'none'}</span>;
}

function MessageConsumer() {
  const ctx = useChatMessageContext();
  return <span>{ctx ? `${ctx.sender}-${ctx.density}` : 'none'}</span>;
}

describe('ChatContext', () => {
  it('returns null outside a provider', () => {
    render(<ListConsumer />);
    expect(screen.getByText('none')).toBeTruthy();
  });

  it('reads density from ChatListContext', () => {
    render(
      <ChatListContext.Provider value={{ density: 'compact' }}>
        <ListConsumer />
      </ChatListContext.Provider>,
    );
    expect(screen.getByText('compact')).toBeTruthy();
  });

  it('reads sender and density from ChatMessageContext', () => {
    render(
      <ChatMessageContext.Provider value={{ sender: 'user', density: 'spacious' }}>
        <MessageConsumer />
      </ChatMessageContext.Provider>,
    );
    expect(screen.getByText('user-spacious')).toBeTruthy();
  });
});
