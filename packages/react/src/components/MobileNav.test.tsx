import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { MobileNav, MobileNavProvider } from './MobileNav';

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('MobileNav', () => {
  it('renders nothing when closed, and its children when isOpen is true', () => {
    const { rerender } = wrap(
      <MobileNav isOpen={false}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    expect(screen.queryByText('Drawer content')).toBeNull();

    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <MobileNav isOpen>
            <p>Drawer content</p>
          </MobileNav>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.getByText('Drawer content')).toBeTruthy();
  });

  it('renders header content and children together', () => {
    wrap(
      <MobileNav isOpen header="Menu">
        <p>Dashboard link</p>
      </MobileNav>,
    );
    expect(screen.getByText('Menu')).toBeTruthy();
    expect(screen.getByText('Dashboard link')).toBeTruthy();
  });

  it('calls onOpenChange(false) on Escape', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <MobileNav isOpen onOpenChange={onOpenChange}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) on backdrop click', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <MobileNav isOpen onOpenChange={onOpenChange}>
        <p>Drawer content</p>
      </MobileNav>,
    );
    const dialog = screen.getByRole('dialog');
    // The backdrop is the ModalOverlay's own underlay element, an ancestor of the dialog panel.
    const backdrop = dialog.parentElement?.parentElement;
    expect(backdrop).toBeTruthy();
    await userEvent.click(backdrop as Element);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) when the close button is pressed', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <MobileNav isOpen onOpenChange={onOpenChange} closeLabel="Close nav">
        <p>Drawer content</p>
      </MobileNav>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close nav' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('positions the panel via data-side, defaulting "auto" to "start"', () => {
    wrap(
      <MobileNav isOpen>
        <p>Drawer content</p>
      </MobileNav>,
    );
    const panel = screen.getByRole('dialog').parentElement;
    expect(panel?.getAttribute('data-side')).toBe('start');
  });

  it('supports the "end" side', () => {
    wrap(
      <MobileNav isOpen side="end">
        <p>Drawer content</p>
      </MobileNav>,
    );
    const panel = screen.getByRole('dialog').parentElement;
    expect(panel?.getAttribute('data-side')).toBe('end');
  });

  describe('MobileNav.Toggle', () => {
    it('calls an explicit onPress handler and reflects isOpen via aria-expanded', async () => {
      function Demo() {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <>
            <MobileNav.Toggle isOpen={isOpen} onPress={() => setIsOpen(true)} />
            <MobileNav isOpen={isOpen} onOpenChange={setIsOpen}>
              <p>Drawer content</p>
            </MobileNav>
          </>
        );
      }
      wrap(<Demo />);
      const toggle = screen.getByRole('button', { name: 'Open navigation' });
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(screen.queryByText('Drawer content')).toBeNull();

      await userEvent.click(toggle);
      expect(screen.getByText('Drawer content')).toBeTruthy();
    });

    it('opens the drawer through a shared MobileNavProvider with no explicit handlers', async () => {
      wrap(
        <MobileNavProvider>
          <MobileNav.Toggle />
          <MobileNav>
            <p>Drawer content</p>
          </MobileNav>
        </MobileNavProvider>,
      );
      expect(screen.queryByText('Drawer content')).toBeNull();

      await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
      expect(screen.getByText('Drawer content')).toBeTruthy();
    });
  });
});
