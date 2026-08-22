import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders title and body when open', () => {
    render(
      <IconProvider icons={{}}>
        <Drawer isOpen title="Settings" onOpenChange={() => {}}>
          <p>Drawer body</p>
        </Drawer>
      </IconProvider>,
    );

    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Drawer body')).toBeTruthy();
    expect(document.querySelector('[class*="var-ui-drawer"]')).toBeTruthy();
  });

  it('labels a compound drawer without a title via aria-label', () => {
    render(
      <IconProvider icons={{}}>
        <Drawer.Root isOpen aria-label="Navigation drawer">
          <Drawer.Backdrop>
            <Drawer.Panel>
              <Drawer.Body>Navigation links</Drawer.Body>
            </Drawer.Panel>
          </Drawer.Backdrop>
        </Drawer.Root>
      </IconProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'Navigation drawer' })).toBeTruthy();
    expect(screen.getByText('Navigation links')).toBeTruthy();
  });

  it('preserves a consumer onPointerDown handler on the backdrop', () => {
    const onPointerDown = vi.fn();
    render(
      <IconProvider icons={{}}>
        <Drawer isOpen title="Settings" onPointerDown={onPointerDown}>
          Drawer body
        </Drawer>
      </IconProvider>,
    );

    const backdrop = document.querySelector('.var-ui-drawer__overlay');
    expect(backdrop).toBeTruthy();
    fireEvent.pointerDown(backdrop!);

    expect(onPointerDown).toHaveBeenCalledOnce();
  });
});
