import { describe, expect, it, vi } from 'vite-plus/test';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Toast, ToastProvider, ToastQueue, ToastRegion, useToast } from './Toast';
import { Button } from './Button';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('Toast presentational', () => {
  it('renders title/description and dismisses', async () => {
    const onDismiss = vi.fn();
    wrap(<Toast tone="success" title="Saved" description="Draft stored." onDismiss={onDismiss} />);
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Draft stored.')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('useToast', () => {
  it('throws outside ToastProvider', () => {
    expect(() => {
      function Boom() {
        useToast();
        return null;
      }
      wrap(<Boom />);
    }).toThrow(/ToastProvider/);
  });

  it('adds and auto-dismisses a toast', async () => {
    function Trigger() {
      const toast = useToast();
      return (
        <Button onPress={() => toast.add({ tone: 'info', title: 'Hello', durationMs: 50 })}>
          Notify
        </Button>
      );
    }
    wrap(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Hello')).toBeTruthy();
    await waitFor(() => expect(screen.queryByText('Hello')).toBeNull());
  });
});

describe('ToastRegion', () => {
  it('renders items from a locally constructed queue, without a provider', () => {
    const queue = new ToastQueue<{ title: string; tone?: 'info' }>();
    wrap(<ToastRegion queue={queue} />);
    act(() => {
      queue.add({ title: 'Standalone' });
    });
    expect(screen.getByText('Standalone')).toBeTruthy();
  });
});
