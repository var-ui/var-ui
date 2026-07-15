import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Button } from './Button';
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
      <Tooltip content="More info">
        <Button>Hover me</Button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect((await screen.findByRole('tooltip')).textContent).toBe('More info');
  });
});
