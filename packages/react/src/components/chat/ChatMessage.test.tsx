import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './ChatMessage';
import { useChatMessageContext } from './ChatContext';

function SenderProbe() {
  const ctx = useChatMessageContext();
  return <span data-testid="probe">{ctx?.sender}</span>;
}

describe('ChatMessage', () => {
  it('renders name, children, and metadata', () => {
    render(
      <ChatMessage sender="assistant" name="Navi" metadata="2:30 PM">
        Hello!
      </ChatMessage>,
    );
    expect(screen.getByText('Navi')).toBeTruthy();
    expect(screen.getByText('Hello!')).toBeTruthy();
    expect(screen.getByText('2:30 PM')).toBeTruthy();
  });

  it('applies the sender variant attr to the root', () => {
    const { container } = render(<ChatMessage sender="user">Hi</ChatMessage>);
    expect((container.firstElementChild as HTMLElement).getAttribute('data-sender')).toBe('user');
  });

  it('provides sender via ChatMessageContext to descendants', () => {
    render(
      <ChatMessage sender="user">
        <SenderProbe />
      </ChatMessage>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('user');
  });

  it('renders the avatar slot when provided', () => {
    render(
      <ChatMessage sender="assistant" avatar={<span data-testid="av">A</span>}>
        Hi
      </ChatMessage>,
    );
    expect(screen.getByTestId('av')).toBeTruthy();
  });
});
