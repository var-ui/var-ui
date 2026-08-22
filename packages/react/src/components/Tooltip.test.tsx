import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Button } from './Button';
import { SimpleTooltip } from './SimpleTooltip';
import { Tooltip } from './Tooltip';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('Tooltip', () => {
  it('shows tooltip content on hover', async () => {
    wrap(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup placement="top">More about this field</Tooltip.Popup>
      </Tooltip.Root>,
    );
    await userEvent.hover(screen.getByRole('button', { name: 'Info' }));
    expect((await screen.findByRole('tooltip')).textContent).toBe('More about this field');
  });

  it('shows tooltip content on focus', async () => {
    wrap(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>
          <button type="button">Info</button>
        </Tooltip.Trigger>
        <Tooltip.Popup>More about this field</Tooltip.Popup>
      </Tooltip.Root>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('More about this field');
  });
});

describe('SimpleTooltip', () => {
  it('still accepts content', async () => {
    wrap(
      <SimpleTooltip content="More info" delay={0}>
        <Button>Hover me</Button>
      </SimpleTooltip>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('More info');
  });
});
