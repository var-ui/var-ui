import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Thumbnail } from './Thumbnail';
import { Timestamp } from './Timestamp';

describe('Timestamp', () => {
  it('renders a time element with ISO datetime and relative text', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000);
    render(<Timestamp date={fiveMinAgo} locale="en" />);
    const time = document.querySelector('time') as HTMLTimeElement;
    expect(time.dateTime).toBe(fiveMinAgo.toISOString());
    expect(time.textContent).toContain('minute');
  });

  it('formats absolute dates', () => {
    render(<Timestamp date="2026-01-15T12:00:00Z" format="date" locale="en-US" />);
    const time = document.querySelector('time') as HTMLTimeElement;
    expect(time.textContent).toMatch(/Jan|January/);
  });
});

describe('Thumbnail', () => {
  it('renders the image and fires onDismiss', async () => {
    const onDismiss = vi.fn();
    render(
      <IconProvider icons={{}}>
        <Thumbnail src="https://example.com/x.png" alt="Attachment" onDismiss={onDismiss} />
      </IconProvider>,
    );
    expect(screen.getByRole('img', { name: 'Attachment' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('omits the dismiss control without onDismiss', () => {
    render(
      <IconProvider icons={{}}>
        <Thumbnail src="https://example.com/x.png" alt="Plain" />
      </IconProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});
