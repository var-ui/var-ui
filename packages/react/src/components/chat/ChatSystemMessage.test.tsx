import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatSystemMessage } from './ChatSystemMessage';

describe('ChatSystemMessage', () => {
  it('renders children with role status', () => {
    render(<ChatSystemMessage>Alex joined the conversation</ChatSystemMessage>);
    expect(screen.getByRole('status').textContent).toContain('Alex joined the conversation');
  });

  it('applies the tone variant class', () => {
    const { container } = render(<ChatSystemMessage tone="warning">Careful</ChatSystemMessage>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-system-message-root-tone-warning',
    );
  });

  it('renders an optional icon', () => {
    render(<ChatSystemMessage icon={<span data-testid="ic" />}>With icon</ChatSystemMessage>);
    expect(screen.getByTestId('ic')).toBeTruthy();
  });
});
