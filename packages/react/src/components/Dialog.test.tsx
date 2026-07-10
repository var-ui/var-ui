import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('opens on trigger press and shows the title/description', async () => {
    render(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog triggerLabel="Open dialog" title="Confirm" description="Are you sure?" />
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
          <Dialog
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
