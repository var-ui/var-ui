import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useTableSelection } from './useTableSelection';

type Row = { id: string; name: string };

const data: Row[] = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
  { id: 'c', name: 'Charlie' },
];

const getRowId = (row: Row) => row.id;

describe('useTableSelection', () => {
  it('starts empty when no default/controlled keys are given', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, mode: 'multiple' }));
    expect(result.current.selectedKeys.size).toBe(0);
    expect(result.current.isSelected('a')).toBe(false);
  });

  it('respects defaultSelectedKeys (uncontrolled)', () => {
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, mode: 'multiple', defaultSelectedKeys: ['a', 'b'] }),
    );
    expect(result.current.selectedKeys).toEqual(new Set(['a', 'b']));
    expect(result.current.isSelected('a')).toBe(true);
    expect(result.current.isSelected('c')).toBe(false);
  });

  it('multiple mode: toggle adds and removes keys', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, mode: 'multiple' }));
    act(() => result.current.toggle('a'));
    expect(result.current.selectedKeys).toEqual(new Set(['a']));
    act(() => result.current.toggle('b'));
    expect(result.current.selectedKeys).toEqual(new Set(['a', 'b']));
    act(() => result.current.toggle('a'));
    expect(result.current.selectedKeys).toEqual(new Set(['b']));
  });

  it('single mode: toggle replaces the current selection', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, mode: 'single' }));
    act(() => result.current.toggle('a'));
    expect(result.current.selectedKeys).toEqual(new Set(['a']));
    act(() => result.current.toggle('b'));
    expect(result.current.selectedKeys).toEqual(new Set(['b']));
  });

  it('single mode: toggling the selected key again deselects it', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, mode: 'single' }));
    act(() => result.current.toggle('a'));
    expect(result.current.selectedKeys).toEqual(new Set(['a']));
    act(() => result.current.toggle('a'));
    expect(result.current.selectedKeys.size).toBe(0);
  });

  it('selectAll selects every row id in multiple mode', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, mode: 'multiple' }));
    act(() => result.current.selectAll());
    expect(result.current.selectedKeys).toEqual(new Set(['a', 'b', 'c']));
  });

  it('selectAll selects only the first row id in single mode', () => {
    const { result } = renderHook(() => useTableSelection({ data, getRowId, mode: 'single' }));
    act(() => result.current.selectAll());
    expect(result.current.selectedKeys).toEqual(new Set(['a']));
  });

  it('clear empties the selection', () => {
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, mode: 'multiple', defaultSelectedKeys: ['a', 'b'] }),
    );
    act(() => result.current.clear());
    expect(result.current.selectedKeys.size).toBe(0);
  });

  it('calls onSelectionChange whenever selection changes', () => {
    const onSelectionChange = vi.fn();
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, mode: 'multiple', onSelectionChange }),
    );
    act(() => result.current.toggle('a'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['a']));
  });

  it('is controlled when selectedKeys is provided — internal state does not change', () => {
    const onSelectionChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ selectedKeys }: { selectedKeys: Iterable<string> }) =>
        useTableSelection({ data, getRowId, mode: 'multiple', selectedKeys, onSelectionChange }),
      { initialProps: { selectedKeys: ['a'] } },
    );
    expect(result.current.selectedKeys).toEqual(new Set(['a']));

    act(() => result.current.toggle('b'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['a', 'b']));
    // Controlled: prop unchanged, so selection is unaffected by the internal toggle call.
    expect(result.current.selectedKeys).toEqual(new Set(['a']));

    rerender({ selectedKeys: ['a', 'b'] });
    expect(result.current.selectedKeys).toEqual(new Set(['a', 'b']));
  });

  it('onSelectionChange exposed on the result can be called directly', () => {
    const onSelectionChange = vi.fn();
    const { result } = renderHook(() =>
      useTableSelection({ data, getRowId, mode: 'multiple', onSelectionChange }),
    );
    act(() => result.current.onSelectionChange(new Set(['c'])));
    expect(result.current.selectedKeys).toEqual(new Set(['c']));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['c']));
  });
});
