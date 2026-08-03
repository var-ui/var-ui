import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
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
});
