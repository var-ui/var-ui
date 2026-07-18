import { type RefObject } from 'react';
import { describe, expect, it, afterEach } from 'vite-plus/test';
import { render, act } from '@testing-library/react';
import { useOverflow } from './useOverflow';

type RectStub = { width: number };

function installRectStub(widths: Map<string, RectStub>): () => void {
  const original = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function stubbedRect(this: HTMLElement) {
    const key = this.dataset.rectKey;
    const width = key ? (widths.get(key)?.width ?? 0) : 0;
    return {
      width,
      height: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    } as DOMRect;
  };
  return () => {
    HTMLElement.prototype.getBoundingClientRect = original;
  };
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

type HarnessProps = {
  items: string[];
  maxVisible?: number;
};

function Harness({ items, maxVisible }: HarnessProps) {
  const { containerRef, measureRef, visibleItems, hiddenItems } = useOverflow(items, {
    maxVisible,
    gapPx: 8,
  });
  return (
    <div>
      <div
        ref={containerRef as RefObject<HTMLDivElement>}
        data-testid="container"
        data-rect-key="container"
      />
      <div ref={measureRef as RefObject<HTMLDivElement>} data-testid="measure">
        {items.map((item) => (
          <span key={item} data-rect-key={`item-${item}`}>
            {item}
          </span>
        ))}
        <span data-rect-key="indicator">indicator</span>
      </div>
      <div data-testid="visible">{visibleItems.join(',')}</div>
      <div data-testid="hidden">{hiddenItems.join(',')}</div>
    </div>
  );
}

describe('useOverflow', () => {
  let restoreRect: (() => void) | null = null;

  afterEach(() => {
    restoreRect?.();
    restoreRect = null;
  });

  it('returns all items visible when the container is wide enough', () => {
    const widths = new Map<string, RectStub>([
      ['container', { width: 1000 }],
      ['item-a', { width: 50 }],
      ['item-b', { width: 50 }],
      ['item-c', { width: 50 }],
      ['indicator', { width: 30 }],
    ]);
    restoreRect = installRectStub(widths);

    const { getByTestId } = render(<Harness items={['a', 'b', 'c']} />);

    expect(getByTestId('visible').textContent).toBe('a,b,c');
    expect(getByTestId('hidden').textContent).toBe('');
  });

  it('hides tail items and reserves indicator width when the container is narrow', () => {
    const widths = new Map<string, RectStub>([
      ['container', { width: 140 }],
      ['item-a', { width: 50 }],
      ['item-b', { width: 50 }],
      ['item-c', { width: 50 }],
      ['indicator', { width: 30 }],
    ]);
    restoreRect = installRectStub(widths);

    const { getByTestId } = render(<Harness items={['a', 'b', 'c']} />);

    // Item a (50) fits; a + b (108, plus reserved indicator 30+8=38) = 146 > 140, so b is hidden too.
    expect(getByTestId('visible').textContent).toBe('a');
    expect(getByTestId('hidden').textContent).toBe('b,c');
  });

  it('applies maxVisible as a hard cap even when more items would otherwise fit', () => {
    const widths = new Map<string, RectStub>([
      ['container', { width: 1000 }],
      ['item-a', { width: 50 }],
      ['item-b', { width: 50 }],
      ['item-c', { width: 50 }],
      ['indicator', { width: 30 }],
    ]);
    restoreRect = installRectStub(widths);

    const { getByTestId } = render(<Harness items={['a', 'b', 'c']} maxVisible={1} />);

    expect(getByTestId('visible').textContent).toBe('a');
    expect(getByTestId('hidden').textContent).toBe('b,c');
  });

  it('re-measures when the container resizes', () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    FakeResizeObserver.instances = [];

    const widths = new Map<string, RectStub>([
      ['container', { width: 1000 }],
      ['item-a', { width: 50 }],
      ['item-b', { width: 50 }],
      ['item-c', { width: 50 }],
      ['indicator', { width: 30 }],
    ]);
    restoreRect = installRectStub(widths);

    const { getByTestId } = render(<Harness items={['a', 'b', 'c']} />);
    expect(getByTestId('visible').textContent).toBe('a,b,c');

    widths.set('container', { width: 100 });
    act(() => {
      FakeResizeObserver.instances[0]?.trigger();
    });

    expect(getByTestId('visible').textContent).toBe('a');
    expect(getByTestId('hidden').textContent).toBe('b,c');

    (globalThis as { ResizeObserver: unknown }).ResizeObserver = originalResizeObserver;
  });

  it('shows all items when disabled', () => {
    const widths = new Map<string, RectStub>([
      ['container', { width: 10 }],
      ['item-a', { width: 50 }],
      ['item-b', { width: 50 }],
      ['indicator', { width: 30 }],
    ]);
    restoreRect = installRectStub(widths);

    const { getByTestId } = render(<DisabledHarness />);
    expect(getByTestId('visible').textContent).toBe('a,b');
    expect(getByTestId('hidden').textContent).toBe('');
  });
});

function DisabledHarness() {
  const { containerRef, measureRef, visibleItems, hiddenItems } = useOverflow(['a', 'b'], {
    enabled: false,
  });
  return (
    <div>
      <div ref={containerRef as RefObject<HTMLDivElement>} data-rect-key="container" />
      <div ref={measureRef as RefObject<HTMLDivElement>}>
        <span data-rect-key="item-a" />
        <span data-rect-key="item-b" />
        <span data-rect-key="indicator" />
      </div>
      <div data-testid="visible">{visibleItems.join(',')}</div>
      <div data-testid="hidden">{hiddenItems.join(',')}</div>
    </div>
  );
}
