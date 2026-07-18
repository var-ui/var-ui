import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useTableSort, type SortDescriptor } from './useTableSort';

type Row = { id: string; name: string; age: number };

const data: Row[] = [
  { id: '1', name: 'Charlie', age: 30 },
  { id: '2', name: 'Alice', age: 25 },
  { id: '3', name: 'Bob', age: 35 },
];

describe('useTableSort', () => {
  it('returns data unsorted when no sortDescriptor/defaultSort is given', () => {
    const { result } = renderHook(() => useTableSort({ data }));
    expect(result.current.sortedData).toEqual(data);
    expect(result.current.sortDescriptor).toBeUndefined();
  });

  it('sorts ascending by string column via defaultSort (uncontrolled)', () => {
    const { result } = renderHook(() =>
      useTableSort({ data, defaultSort: { column: 'name', direction: 'ascending' } }),
    );
    expect(result.current.sortedData.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('sorts descending by numeric column', () => {
    const { result } = renderHook(() =>
      useTableSort({ data, defaultSort: { column: 'age', direction: 'descending' } }),
    );
    expect(result.current.sortedData.map((r) => r.age)).toEqual([35, 30, 25]);
  });

  it('toggles direction via onSortChange in uncontrolled mode', () => {
    const { result } = renderHook(() => useTableSort({ data }));
    act(() => result.current.onSortChange({ column: 'name', direction: 'ascending' }));
    expect(result.current.sortDescriptor).toEqual({ column: 'name', direction: 'ascending' });
    expect(result.current.sortedData.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);

    act(() => result.current.onSortChange({ column: 'name', direction: 'descending' }));
    expect(result.current.sortDescriptor).toEqual({ column: 'name', direction: 'descending' });
    expect(result.current.sortedData.map((r) => r.name)).toEqual(['Charlie', 'Bob', 'Alice']);
  });

  it('is controlled when sortDescriptor is provided — internal state does not change', () => {
    const onSortChange = vi.fn();
    const initialSort: SortDescriptor = { column: 'name', direction: 'ascending' };
    const { result, rerender } = renderHook(
      ({ sortDescriptor }: { sortDescriptor: SortDescriptor }) =>
        useTableSort({ data, sortDescriptor, onSortChange }),
      { initialProps: { sortDescriptor: initialSort } },
    );
    expect(result.current.sortedData.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);

    act(() => result.current.onSortChange({ column: 'name', direction: 'descending' }));
    expect(onSortChange).toHaveBeenCalledWith({ column: 'name', direction: 'descending' });
    // Controlled: sortDescriptor prop hasn't changed, so sortedData stays as-is.
    expect(result.current.sortedData.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);

    rerender({ sortDescriptor: { column: 'name', direction: 'descending' } });
    expect(result.current.sortedData.map((r) => r.name)).toEqual(['Charlie', 'Bob', 'Alice']);
  });

  it('uses a custom getSortValue comparator', () => {
    const { result } = renderHook(() =>
      useTableSort({
        data,
        defaultSort: { column: 'name', direction: 'ascending' },
        getSortValue: (row, column) =>
          column === 'name' ? row.name.length : row[column as keyof Row],
      }),
    );
    // Sorted by name length ascending: Bob(3), Alice(5), Charlie(7)
    expect(result.current.sortedData.map((r) => r.name)).toEqual(['Bob', 'Alice', 'Charlie']);
  });

  it('does not mutate the original data array', () => {
    const original = [...data];
    renderHook(() =>
      useTableSort({ data, defaultSort: { column: 'name', direction: 'ascending' } }),
    );
    expect(data).toEqual(original);
  });

  it('handles null/undefined values by sorting them to the end (ascending)', () => {
    const rows = [{ v: 2 }, { v: null }, { v: 1 }, { v: undefined }];
    const { result } = renderHook(() =>
      useTableSort({ data: rows, defaultSort: { column: 'v', direction: 'ascending' } }),
    );
    expect(result.current.sortedData.map((r) => r.v)).toEqual([1, 2, null, undefined]);
  });

  it('handles null/undefined values by sorting them to the end (descending)', () => {
    const rows = [{ v: 2 }, { v: null }, { v: 1 }, { v: undefined }];
    const { result } = renderHook(() =>
      useTableSort({ data: rows, defaultSort: { column: 'v', direction: 'descending' } }),
    );
    expect(result.current.sortedData.map((r) => r.v)).toEqual([2, 1, null, undefined]);
  });
});
