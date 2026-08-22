import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import type { OverlayOpenChangeHandler } from '../overlays';
import { Button } from './Button';
import { Menu } from './Menu';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

function renderCompound(onOpenChange?: OverlayOpenChangeHandler, onAction = vi.fn()) {
  return {
    onAction,
    ...wrap(
      <Menu.Root onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <button type="button">Song</button>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item id="lib" onAction={onAction}>
            Add to Library
          </Menu.Item>
          <Menu.Separator />
          <Menu.Section title="Danger">
            <Menu.Item id="delete" onAction={vi.fn()}>
              Delete
            </Menu.Item>
          </Menu.Section>
        </Menu.Popup>
      </Menu.Root>,
    ),
  };
}

describe('Menu', () => {
  it('invokes onAction when an item is selected', async () => {
    const onAction = vi.fn();
    wrap(
      <Menu.Root>
        <Menu.Trigger>
          <Button>Song</Button>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item id="lib" onAction={onAction}>
            Add to Library
          </Menu.Item>
          <Menu.Separator />
          <Menu.Section title="Danger">
            <Menu.Item id="delete" onAction={vi.fn()}>
              Delete
            </Menu.Item>
          </Menu.Section>
        </Menu.Popup>
      </Menu.Root>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menuitem', { name: 'Add to Library' })).toBeTruthy();
    expect(screen.getByRole('separator')).toBeTruthy();
    expect(screen.getByText('Danger')).toBeTruthy();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Add to Library' }));
    expect(onAction).toHaveBeenCalled();
  });

  it('reports trigger-press when opened from the trigger', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('trigger-press');
  });

  it('reports outside-press when dismissed via the overlay', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
    onOpenChange.mockClear();

    const underlay = document.querySelector('[data-testid="underlay"]');
    expect(underlay).toBeTruthy();
    await userEvent.click(underlay!);

    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('outside-press');
  });

  it('reports escape-key when dismissed with Escape', async () => {
    const onOpenChange = vi.fn<OverlayOpenChangeHandler>();
    renderCompound(onOpenChange);
    await userEvent.click(screen.getByRole('button', { name: 'Song' }));
    expect(await screen.findByRole('menu')).toBeTruthy();
    onOpenChange.mockClear();

    await userEvent.keyboard('{Escape}');

    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(onOpenChange.mock.calls[0]?.[1].reason).toBe('escape-key');
  });

  it('keeps the menu open when cancel() is called while uncontrolled', async () => {
    const onOpenChange: OverlayOpenChangeHandler = (_next, details) => {
      details.cancel();
    };
    wrap(
      <Menu.Root defaultOpen onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <button type="button">Song</button>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item id="lib" onAction={vi.fn()}>
            Add to Library
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    expect(await screen.findByRole('menuitem', { name: 'Add to Library' })).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('menuitem', { name: 'Add to Library' })).toBeTruthy();
  });

  it('supports controlled isOpen', () => {
    function Controlled() {
      const [open] = useState(true);
      return (
        <Menu.Root isOpen={open}>
          <Menu.Popup>
            <Menu.Item id="lib" onAction={vi.fn()}>
              Pinned
            </Menu.Item>
          </Menu.Popup>
        </Menu.Root>
      );
    }
    wrap(<Controlled />);
    expect(screen.getByRole('menuitem', { name: 'Pinned' })).toBeTruthy();
  });
});
