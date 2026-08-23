import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Button } from './Button';
import { DropdownMenu } from './DropdownMenu';

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('DropdownMenu', () => {
  it('opens menu items from the trigger via sections', async () => {
    const onAction = vi.fn();
    wrap(
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        sections={[{ items: [{ id: 'edit', label: 'Edit', onAction }] }]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(await screen.findByRole('menuitem', { name: 'Edit' })).toBeTruthy();
  });
});
