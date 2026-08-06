import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useTableFilter } from './useTableFilter';

type Row = { id: string; name: string; region: string };

const data: Row[] = [
  { id: '1', name: 'api-gateway', region: 'us-west-2' },
  { id: '2', name: 'worker-queue', region: 'us-east-1' },
  { id: '3', name: 'cache-primary', region: 'eu-central-1' },
];

describe('useTableFilter', () => {
  it('returns all rows when query is empty', () => {
    const { result } = renderHook(() => useTableFilter({ data }));
    expect(result.current.filteredData).toEqual(data);
    expect(result.current.query).toBe('');
  });

  it('filters by case-insensitive substring across default string keys', () => {
    const { result } = renderHook(() => useTableFilter({ data, defaultQuery: 'worker' }));
    expect(result.current.filteredData).toEqual([data[1]]);
  });

  it('matches any configured search key', () => {
    const { result } = renderHook(() =>
      useTableFilter({ data, defaultQuery: 'eu-central', searchKeys: ['region'] }),
    );
    expect(result.current.filteredData).toEqual([data[2]]);
  });

  it('updates query via onQueryChange in uncontrolled mode', () => {
    const { result } = renderHook(() => useTableFilter({ data }));
    act(() => result.current.onQueryChange('cache'));
    expect(result.current.query).toBe('cache');
    expect(result.current.filteredData).toEqual([data[2]]);
  });

  it('is controlled when query is provided', () => {
    const onQueryChange = vi.fn<(query: string) => void>();
    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useTableFilter({ data, query, onQueryChange }),
      { initialProps: { query: 'api' } },
    );
    expect(result.current.filteredData).toEqual([data[0]]);

    act(() => result.current.onQueryChange('worker'));
    expect(onQueryChange).toHaveBeenCalledWith('worker');
    expect(result.current.filteredData).toEqual([data[0]]);

    rerender({ query: 'worker' });
    expect(result.current.filteredData).toEqual([data[1]]);
  });

  it('uses a custom filterFn', () => {
    const { result } = renderHook(() =>
      useTableFilter({
        data,
        defaultQuery: 'x',
        filterFn: (row) => row.region.startsWith('us'),
      }),
    );
    expect(result.current.filteredData).toEqual([data[0], data[1]]);
  });

  it('does not mutate the original data array', () => {
    const original = [...data];
    renderHook(() => useTableFilter({ data, defaultQuery: 'cache' }));
    expect(data).toEqual(original);
  });
});
