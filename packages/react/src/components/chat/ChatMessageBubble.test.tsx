import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessageContext } from './ChatContext';
import { ChatMessageBubble } from './ChatMessageBubble';

describe('ChatMessageBubble', () => {
  it('renders children', () => {
    render(<ChatMessageBubble>Hello there</ChatMessageBubble>);
    expect(screen.getByText('Hello there')).toBeTruthy();
  });

  it('applies the sender class from context', () => {
    const { container } = render(
      <ChatMessageContext.Provider value={{ sender: 'user', density: 'balanced' }}>
        <ChatMessageBubble>Hi</ChatMessageBubble>
      </ChatMessageContext.Provider>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-message-bubble-root-sender-user',
    );
  });

  it('defaults to assistant sender outside context', () => {
    const { container } = render(<ChatMessageBubble>Hi</ChatMessageBubble>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-message-bubble-root-sender-assistant',
    );
  });

  it('maps group to the "none" default when omitted', () => {
    const { container } = render(<ChatMessageBubble>Hi</ChatMessageBubble>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-message-bubble-root-group-none',
    );
  });
});
