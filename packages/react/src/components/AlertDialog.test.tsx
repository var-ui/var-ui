import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { LayerProvider } from '../layers/LayerProvider';
import { AlertDialog } from './AlertDialog';

function wrap(children: ReactElement) {
  return render(<LayerProvider>{children}</LayerProvider>);
}

describe('AlertDialog', () => {
  it('renders with alertdialog role and shows title/description', async () => {
    wrap(
      <AlertDialog
        triggerLabel="Open delete"
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    expect(screen.getByText('Delete item?')).toBeTruthy();
    expect(screen.getByText('This cannot be undone.')).toBeTruthy();
  });

  it('calls onConfirm on confirm and not on cancel, focusing Cancel when destructive', async () => {
    const onConfirm = vi.fn();
    wrap(
      <AlertDialog
        triggerLabel="Open delete"
        title="Delete item?"
        description="This cannot be undone."
        isDestructive
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not call onConfirm when dismissed via Escape', async () => {
    const onConfirm = vi.fn();
    wrap(
      <AlertDialog
        triggerLabel="Open delete"
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open delete' }));
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('uses primary intent for confirm when not destructive', async () => {
    wrap(
      <AlertDialog
        triggerLabel="Open archive"
        title="Archive item?"
        description="You can restore it later."
        confirmLabel="Archive"
        onConfirm={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open archive' }));
    const confirmButton = screen.getByRole('button', { name: 'Archive' });
    expect(document.activeElement).not.toBe(screen.getByRole('button', { name: 'Cancel' }));
    expect(confirmButton.className).not.toContain('danger');
  });

  it('supports controlled isOpen/onOpenChange without a trigger', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <AlertDialog
        isOpen
        onOpenChange={onOpenChange}
        title="Delete item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
