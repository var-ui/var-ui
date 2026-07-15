import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../../icons';
import { ChatSendButton } from './ChatSendButton';

describe('ChatSendButton', () => {
  it('calls onPress when not streaming', async () => {
    const onPress = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton onPress={onPress} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onStop and swaps the label while streaming', async () => {
    const onStop = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton isStreaming onStop={onStop} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('disables the button when isDisabled and not streaming', () => {
    render(
      <IconProvider icons={{}}>
        <ChatSendButton isDisabled />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Send message' }).hasAttribute('disabled')).toBe(
      true,
    );
  });

  it('ignores isDisabled while streaming (stop stays pressable)', async () => {
    const onStop = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton isStreaming isDisabled onStop={onStop} />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Stop generating' }).hasAttribute('disabled')).toBe(
      false,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
