import { describe, expect, it, vi } from 'vite-plus/test';
import { render, within, act } from '@testing-library/react';
import { OverflowList } from './OverflowList';

/** The visible row is always the first DOM child; the hidden measure row (all items) is the second. */
function visibleRoot(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement;
}

type ResizeCallback = () => void;

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  callback: ResizeCallback;
  constructor(callback: ResizeCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }
  observe() {}
  disconnect() {}
  trigger() {
    this.callback();
  }
}

describe('OverflowList', () => {
  it('renders compound Item children', () => {
    const { container } = render(
      <OverflowList gap="none" renderOverflow={(hidden) => <span>+{hidden.length}</span>}>
        <OverflowList.Item>Alpha</OverflowList.Item>
        <OverflowList.Item>Beta</OverflowList.Item>
      </OverflowList>,
    );
    const scope = within(visibleRoot(container));
    expect(scope.getByText('Alpha')).toBeTruthy();
    expect(scope.getByText('Beta')).toBeTruthy();
  });

  it('renders items-array mode with renderItem', () => {
    const { container } = render(
      <OverflowList
        gap="none"
        items={[{ id: 'a', label: 'Ada' }]}
        renderItem={(item) => item.label}
        renderOverflow={(hidden) => <span>+{hidden.length}</span>}
      />,
    );
    expect(within(visibleRoot(container)).getByText('Ada')).toBeTruthy();
  });

  it('falls back to rendering the raw item when renderItem is omitted', () => {
    const { container } = render(
      <OverflowList
        gap="none"
        items={['Alpha', 'Beta']}
        renderOverflow={(hidden) => <span>+{hidden.length}</span>}
      />,
    );
    const scope = within(visibleRoot(container));
    expect(scope.getByText('Alpha')).toBeTruthy();
    expect(scope.getByText('Beta')).toBeTruthy();
  });

  it('does not render the overflow affordance when everything fits', () => {
    const { container } = render(
      <OverflowList
        gap="none"
        items={['Alpha', 'Beta']}
        renderOverflow={(hidden) => <button type="button">+{hidden.length}</button>}
      />,
    );
    expect(within(visibleRoot(container)).queryByRole('button')).toBeNull();
  });

  it('calls renderOverflow and hides tail items when maxVisible caps below the item count', () => {
    const { container } = render(
      <OverflowList
        gap="none"
        items={['Alpha', 'Beta', 'Gamma']}
        maxVisible={1}
        renderOverflow={(hidden) => <button type="button">+{hidden.length}</button>}
      />,
    );
    const scope = within(visibleRoot(container));
    expect(scope.getByText('Alpha')).toBeTruthy();
    expect(scope.queryByText('Beta')).toBeNull();
    expect(scope.queryByText('Gamma')).toBeNull();
    expect(scope.getByRole('button', { name: '+2' })).toBeTruthy();
  });

  it('produces equivalent visible output for items mode and compound children mode with the same maxVisible cap', () => {
    const itemsRender = render(
      <OverflowList
        gap="none"
        items={['Alpha', 'Beta', 'Gamma']}
        maxVisible={2}
        renderOverflow={(hidden) => <span>+{hidden.length}</span>}
      />,
    );
    const itemsScope = within(visibleRoot(itemsRender.container));
    expect(itemsScope.getByText('Alpha')).toBeTruthy();
    expect(itemsScope.getByText('Beta')).toBeTruthy();
    expect(itemsScope.queryByText('Gamma')).toBeNull();
    expect(itemsScope.getByText('+1')).toBeTruthy();
    itemsRender.unmount();

    const childrenRender = render(
      <OverflowList
        gap="none"
        maxVisible={2}
        renderOverflow={(hidden) => <span>+{hidden.length}</span>}
      >
        <OverflowList.Item>Alpha</OverflowList.Item>
        <OverflowList.Item>Beta</OverflowList.Item>
        <OverflowList.Item>Gamma</OverflowList.Item>
      </OverflowList>,
    );
    const childrenScope = within(visibleRoot(childrenRender.container));
    expect(childrenScope.getByText('Alpha')).toBeTruthy();
    expect(childrenScope.getByText('Beta')).toBeTruthy();
    expect(childrenScope.queryByText('Gamma')).toBeNull();
    expect(childrenScope.getByText('+1')).toBeTruthy();
  });

  it('applies fillParent and gap variant data attributes to the root', () => {
    const { container } = render(
      <OverflowList
        items={['Alpha']}
        fillParent
        gap="lg"
        renderOverflow={(hidden) => <span>+{hidden.length}</span>}
      />,
    );
    const root = visibleRoot(container);
    expect(root.hasAttribute('data-fill-parent')).toBe(true);
    expect(root.getAttribute('data-gap')).toBe('lg');
  });

  it('supports a numeric gap override via a CSS custom property', () => {
    const { container } = render(
      <OverflowList
        items={['Alpha']}
        gap={20}
        renderOverflow={(hidden) => <span>+{hidden.length}</span>}
      />,
    );
    const root = visibleRoot(container);
    expect(root.style.getPropertyValue('--var-ui-overflow-list-gap')).toBe('20px');
  });

  it('reserves indicator width and hides tail items once measured widths exceed the container', () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    FakeResizeObserver.instances = [];

    const { container } = render(
      <OverflowList
        gap={8}
        items={['Alpha', 'Beta', 'Gamma']}
        renderOverflow={(hidden) => <button type="button">+{hidden.length}</button>}
      />,
    );
    const root = visibleRoot(container);
    const measureRow = container.lastElementChild as HTMLElement;
    const [itemA, itemB, itemC] = Array.from(measureRow.children).slice(0, 3) as HTMLElement[];
    const indicator = measureRow.lastElementChild as HTMLElement;

    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({ width: 140 } as DOMRect);
    vi.spyOn(itemA, 'getBoundingClientRect').mockReturnValue({ width: 50 } as DOMRect);
    vi.spyOn(itemB, 'getBoundingClientRect').mockReturnValue({ width: 50 } as DOMRect);
    vi.spyOn(itemC, 'getBoundingClientRect').mockReturnValue({ width: 50 } as DOMRect);
    vi.spyOn(indicator, 'getBoundingClientRect').mockReturnValue({ width: 30 } as DOMRect);

    act(() => {
      FakeResizeObserver.instances[FakeResizeObserver.instances.length - 1]?.trigger();
    });

    const scope = within(visibleRoot(container));
    expect(scope.getByText('Alpha')).toBeTruthy();
    expect(scope.queryByText('Beta')).toBeNull();
    expect(scope.getByRole('button', { name: '+2' })).toBeTruthy();

    (globalThis as { ResizeObserver: unknown }).ResizeObserver = originalResizeObserver;
  });

  it('throws when OverflowList.Item is used outside an OverflowList', () => {
    const OrphanItem = OverflowList.Item;
    expect(() => render(<OrphanItem>Orphan</OrphanItem>)).toThrow(
      /must be used within OverflowList/,
    );
  });
});
