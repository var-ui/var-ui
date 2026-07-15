import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../../icons';
import { ChatLayout } from './ChatLayout';

describe('ChatLayout', () => {
  it('renders children and the composer', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div data-testid="composer" />}>
          <div data-testid="messages">messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByTestId('messages')).toBeTruthy();
    expect(screen.getByTestId('composer')).toBeTruthy();
  });

  it('renders emptyState when there are no children', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} emptyState={<span>Start a conversation</span>}>
          {null}
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByText('Start a conversation')).toBeTruthy();
  });

  it('hides the scroll button entirely when scrollButton is null', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} scrollButton={null}>
          <div>messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders a custom scrollButton override', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} scrollButton={<button type="button">Custom</button>}>
          <div>messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Custom' })).toBeTruthy();
  });
});
