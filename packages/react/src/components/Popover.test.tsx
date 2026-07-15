import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Button } from './Button';
import { Popover } from './Popover';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('Popover', () => {
  it('opens on trigger click and shows dialog content', async () => {
    wrap(
      <Popover trigger={<Button>Open</Button>} title="Details">
        Popover body
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Popover body')).toBeTruthy();
  });

  it('closes on Escape', async () => {
    wrap(
      <Popover trigger={<Button>Open</Button>} title="Details">
        Popover body
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
