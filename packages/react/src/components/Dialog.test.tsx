import { useState } from 'react';
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Dialog } from './Dialog';
import { SimpleDialog } from './SimpleDialog';
import { Tooltip } from './Tooltip';

describe('Dialog', () => {
  it('opens from a custom trigger and allows omitting Close', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root>
            <Dialog.Trigger>
              <button type="button">Custom</button>
            </Dialog.Trigger>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Only title</Dialog.Title>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(screen.getByText('Only title')).toBeTruthy();
    expect(screen.queryByLabelText('Close')).toBeNull();
  });

  it('supports controlled isOpen', async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <IconProvider icons={{}}>
          <LayerProvider>
            <Dialog.Root isOpen={open} onOpenChange={(next) => setOpen(next)}>
              <Dialog.Backdrop>
                <Dialog.Popup>
                  <Dialog.Title>Pinned</Dialog.Title>
                </Dialog.Popup>
              </Dialog.Backdrop>
            </Dialog.Root>
          </LayerProvider>
        </IconProvider>
      );
    }
    render(<Controlled />);
    expect(screen.getByText('Pinned')).toBeTruthy();
  });

  it('nests Tooltip on Dialog.Trigger', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root>
            <Tooltip content="Opens the dialog">
              <Dialog.Trigger>
                <button type="button">Custom</button>
              </Dialog.Trigger>
            </Tooltip>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Only title</Dialog.Title>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('Opens the dialog');
  });
});

describe('SimpleDialog', () => {
  it('opens on trigger press and shows the title/description', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SimpleDialog triggerLabel="Open dialog" title="Confirm" description="Are you sure?" />
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByText('Confirm')).toBeTruthy();
    expect(screen.getByText('Are you sure?')).toBeTruthy();
  });

  it('portals the modal into a custom portalContainer when provided', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <SimpleDialog
            triggerLabel="Open dialog"
            title="Confirm"
            description="Are you sure?"
            portalContainer={container}
          />
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

    const heading = await screen.findByText('Confirm');
    expect(container.contains(heading)).toBe(true);

    document.body.removeChild(container);
  });
});
