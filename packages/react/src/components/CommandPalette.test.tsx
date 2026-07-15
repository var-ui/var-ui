import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { LayerProvider } from '../layers/LayerProvider';
import { CommandPalette } from './CommandPalette';

function wrap(children: ReactElement) {
  return render(<LayerProvider>{children}</LayerProvider>);
}

describe('CommandPalette', () => {
  it('filters items and invokes onAction on Enter', async () => {
    const onAction = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings', keywords: ['prefs'] },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={onAction}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'sett');
    expect(screen.getByText('Open settings')).toBeTruthy();
    expect(screen.queryByText('Sign out')).toBeNull();
    await userEvent.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledWith('a');
  });

  it('matches via keywords', async () => {
    const onAction = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings', keywords: ['prefs'] },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={onAction}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'prefs');
    expect(screen.getByText('Open settings')).toBeTruthy();
    expect(screen.queryByText('Sign out')).toBeNull();
  });

  it('matches via meta', async () => {
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings', meta: 'Preferences' },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={() => {}}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'prefer');
    expect(screen.getByText('Open settings')).toBeTruthy();
    expect(screen.queryByText('Sign out')).toBeNull();
  });

  it('renders empty state when nothing matches', async () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Only' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'zzz');
    expect(screen.getByText('No results')).toBeTruthy();
  });

  it('renders empty state without crashing when items is []', () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );
    expect(screen.getByText('No results')).toBeTruthy();
  });

  it('supports a custom emptyLabel and placeholder', () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[]}
        onAction={() => {}}
        onOpenChange={() => {}}
        placeholder="Type a command"
        emptyLabel="Nothing found"
      />,
    );
    expect(screen.getByPlaceholderText('Type a command')).toBeTruthy();
    expect(screen.getByText('Nothing found')).toBeTruthy();
  });

  it('resets the query when closed and reopened', async () => {
    const { rerender } = wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'sett');
    expect((screen.getByPlaceholderText('Search…') as HTMLInputElement).value).toBe('sett');

    rerender(
      <LayerProvider>
        <CommandPalette
          isOpen={false}
          hotkey={false}
          items={[{ id: 'a', title: 'Open settings' }]}
          onAction={() => {}}
          onOpenChange={() => {}}
        />
      </LayerProvider>,
    );
    rerender(
      <LayerProvider>
        <CommandPalette
          isOpen
          hotkey={false}
          items={[{ id: 'a', title: 'Open settings' }]}
          onAction={() => {}}
          onOpenChange={() => {}}
        />
      </LayerProvider>,
    );
    expect((screen.getByPlaceholderText('Search…') as HTMLInputElement).value).toBe('');
  });

  it('toggles open via ⌘K / Ctrl+K when hotkey is enabled (default)', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen={false}
        onOpenChange={onOpenChange}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
      />,
    );
    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle on ⌘K when hotkey is disabled', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen={false}
        onOpenChange={onOpenChange}
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
      />,
    );
    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        onOpenChange={onOpenChange}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText('Search…')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports a custom filter function', async () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings' },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={() => {}}
        onOpenChange={() => {}}
        filter={(item) => item.id === 'b'}
      />,
    );
    expect(screen.getByText('Sign out')).toBeTruthy();
    expect(screen.queryByText('Open settings')).toBeNull();
  });
});
