import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { renderHook } from '@testing-library/react';
import { useTreeFocus, type TreeFocusItem } from './useTreeFocus';

type StubRow = {
  id: string;
  level: number;
  isDisabled?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
};

/** Builds real, connected DOM elements so `.focus()` / `document.activeElement` behave like a browser. */
function buildItems(rows: StubRow[]): TreeFocusItem[] {
  return rows.map((row) => {
    const element = document.createElement('div');
    element.tabIndex = -1;
    element.setAttribute('aria-level', String(row.level));
    if (row.isExpanded) element.setAttribute('aria-expanded', 'true');
    document.body.appendChild(element);
    return {
      id: row.id,
      element,
      isDisabled: row.isDisabled ?? false,
      hasChildren: row.hasChildren ?? false,
      isExpanded: row.isExpanded ?? false,
    };
  });
}

afterEach(() => {
  document.body.innerHTML = '';
});

function focusById(items: TreeFocusItem[], id: string) {
  items.find((item) => item.id === id)?.element.focus();
}

function keydown(key: string) {
  return new KeyboardEvent('keydown', { key, cancelable: true });
}

describe('useTreeFocus', () => {
  it('moves focus to the next/previous visible row on ArrowDown/ArrowUp', () => {
    const items = buildItems([
      { id: 'a', level: 1 },
      { id: 'b', level: 1 },
      { id: 'c', level: 1 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowDown'));
    expect(document.activeElement).toBe(items[1].element);

    result.current.onKeyDown(keydown('ArrowDown'));
    expect(document.activeElement).toBe(items[2].element);

    result.current.onKeyDown(keydown('ArrowUp'));
    expect(document.activeElement).toBe(items[1].element);
  });

  it('does not move past the first/last row (no wrap-around)', () => {
    const items = buildItems([
      { id: 'a', level: 1 },
      { id: 'b', level: 1 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowUp'));
    expect(document.activeElement).toBe(items[0].element);

    focusById(items, 'b');
    result.current.onKeyDown(keydown('ArrowDown'));
    expect(document.activeElement).toBe(items[1].element);
  });

  it('jumps to the first/last row on Home/End', () => {
    const items = buildItems([
      { id: 'a', level: 1 },
      { id: 'b', level: 1 },
      { id: 'c', level: 1 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse: vi.fn() }),
    );

    focusById(items, 'b');
    result.current.onKeyDown(keydown('End'));
    expect(document.activeElement).toBe(items[2].element);

    result.current.onKeyDown(keydown('Home'));
    expect(document.activeElement).toBe(items[0].element);
  });

  it('skips disabled rows entirely on ArrowDown/ArrowUp', () => {
    const items = buildItems([
      { id: 'a', level: 1 },
      { id: 'b', level: 1, isDisabled: true },
      { id: 'c', level: 1 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowDown'));
    expect(document.activeElement).toBe(items[2].element);
  });

  it('calls onExpand on ArrowRight for a collapsed row with children, without moving focus', () => {
    const onExpand = vi.fn();
    const items = buildItems([{ id: 'a', level: 1, hasChildren: true, isExpanded: false }]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand, onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowRight'));
    expect(onExpand).toHaveBeenCalledWith('a');
    expect(document.activeElement).toBe(items[0].element);
  });

  it('moves to the first child on ArrowRight for an already-expanded row', () => {
    const onExpand = vi.fn();
    const items = buildItems([
      { id: 'a', level: 1, hasChildren: true, isExpanded: true },
      { id: 'a1', level: 2 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand, onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowRight'));
    expect(onExpand).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(items[1].element);
  });

  it('is a no-op on ArrowRight for a leaf row', () => {
    const onExpand = vi.fn();
    const items = buildItems([{ id: 'a', level: 1 }]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand, onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowRight'));
    expect(onExpand).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(items[0].element);
  });

  it('calls onCollapse on ArrowLeft for an expanded row, without moving focus', () => {
    const onCollapse = vi.fn();
    const items = buildItems([
      { id: 'a', level: 1, hasChildren: true, isExpanded: true },
      { id: 'a1', level: 2 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowLeft'));
    expect(onCollapse).toHaveBeenCalledWith('a');
    expect(document.activeElement).toBe(items[0].element);
  });

  it('moves to the parent row on ArrowLeft for a collapsed/leaf row', () => {
    const onCollapse = vi.fn();
    const items = buildItems([
      { id: 'a', level: 1, hasChildren: true, isExpanded: true },
      { id: 'a1', level: 2, hasChildren: true, isExpanded: false },
      { id: 'b', level: 1 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse }),
    );

    focusById(items, 'a1');
    result.current.onKeyDown(keydown('ArrowLeft'));
    expect(onCollapse).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(items[0].element);
  });

  it('does nothing on ArrowLeft at the root level with no children', () => {
    const onCollapse = vi.fn();
    const items = buildItems([{ id: 'a', level: 1 }]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('ArrowLeft'));
    expect(onCollapse).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(items[0].element);
  });

  it('calls onSelect on Enter/Space when provided', () => {
    const onSelect = vi.fn();
    const items = buildItems([{ id: 'a', level: 1 }]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse: vi.fn(), onSelect }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('Enter'));
    result.current.onKeyDown(keydown(' '));
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith('a');
  });

  it('is a no-op on Enter/Space when onSelect is not provided (selectionMode "none")', () => {
    const items = buildItems([{ id: 'a', level: 1 }]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    expect(() => result.current.onKeyDown(keydown('Enter'))).not.toThrow();
  });

  it('ignores unrelated keys', () => {
    const items = buildItems([
      { id: 'a', level: 1 },
      { id: 'b', level: 1 },
    ]);
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => items, onExpand: vi.fn(), onCollapse: vi.fn() }),
    );

    focusById(items, 'a');
    result.current.onKeyDown(keydown('a'));
    expect(document.activeElement).toBe(items[0].element);
  });

  it('returns tabIndex -1 for the root — rows own the roving tabindex', () => {
    const { result } = renderHook(() =>
      useTreeFocus({ getItems: () => [], onExpand: vi.fn(), onCollapse: vi.fn() }),
    );
    expect(result.current.tabIndex).toBe(-1);
  });
});
