import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders title, content, and the default tone icon slot', () => {
    render(
      <IconProvider icons={{}}>
        <Banner tone="info" title="Heads up">
          Body copy
        </Banner>
      </IconProvider>,
    );
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.getByText('Heads up')).toBeTruthy();
  });

  it('warning tone uses role alert', () => {
    render(
      <IconProvider icons={{}}>
        <Banner tone="warning">Careful</Banner>
      </IconProvider>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('calls onDismiss and hides the dismiss control otherwise', async () => {
    const onDismiss = vi.fn();
    const { rerender } = render(
      <IconProvider icons={{}}>
        <Banner onDismiss={onDismiss}>Dismissible</Banner>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    rerender(
      <IconProvider icons={{}}>
        <Banner>Not dismissible</Banner>
      </IconProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });
});
