import { describe, expect, it } from 'vite-plus/test';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Link } from './Link';
import { HoverCard } from './HoverCard';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('HoverCard', () => {
  it('shows content on hover after openDelay', async () => {
    wrap(
      <HoverCard
        trigger={<Link href="#profile">@user</Link>}
        title="User"
        openDelay={10}
        closeDelay={10}
      >
        Rich preview content with a <Link href="#more">link</Link>.
      </HoverCard>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.hover(screen.getByRole('link', { name: '@user' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    expect(screen.getByText('User')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'link' })).toBeTruthy();
  });

  it('closes after closeDelay once the pointer leaves the trigger', async () => {
    wrap(
      <HoverCard trigger={<Link href="#profile">@user</Link>} openDelay={10} closeDelay={10}>
        Preview content.
      </HoverCard>,
    );
    const trigger = screen.getByRole('link', { name: '@user' });
    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('stays open when the pointer moves from the trigger into the card', async () => {
    wrap(
      <HoverCard trigger={<Link href="#profile">@user</Link>} openDelay={10} closeDelay={10}>
        Preview with a <Link href="#more">nested link</Link>.
      </HoverCard>,
    );
    const trigger = screen.getByRole('link', { name: '@user' });
    await userEvent.hover(trigger);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    // Synchronous pointer events avoid a race between closeDelay and userEvent's async hover.
    fireEvent.mouseLeave(trigger);
    fireEvent.mouseEnter(dialog);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.mouseLeave(dialog);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('opens and closes via keyboard focus for non-pointer users', async () => {
    wrap(
      <HoverCard trigger={<Link href="#profile">@user</Link>} openDelay={10} closeDelay={10}>
        Preview content.
      </HoverCard>,
    );
    await userEvent.tab();
    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
