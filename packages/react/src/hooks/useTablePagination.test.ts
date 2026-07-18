import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useTablePagination } from './useTablePagination';

const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

describe('useTablePagination', () => {
  it('defaults to page 1 and slices the first page', () => {
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10 }));
    expect(result.current.page).toBe(1);
    expect(result.current.pageData.map((r) => r.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.current.totalPages).toBe(3);
  });

  it('respects defaultPage (uncontrolled)', () => {
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10, defaultPage: 2 }));
    expect(result.current.page).toBe(2);
    expect(result.current.pageData.map((r) => r.id)).toEqual([
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
  });

  it('slices the last (partial) page correctly', () => {
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10, defaultPage: 3 }));
    expect(result.current.pageData.map((r) => r.id)).toEqual([21, 22, 23, 24, 25]);
  });

  it('setPage moves to a new page (uncontrolled)', () => {
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10 }));
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    expect(result.current.pageData.map((r) => r.id)).toEqual([
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
  });

  it('clamps page to 1 when setPage is called with a value below 1', () => {
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10 }));
    act(() => result.current.setPage(-5));
    expect(result.current.page).toBe(1);
  });

  it('clamps page to totalPages when setPage is called above the max', () => {
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10 }));
    act(() => result.current.setPage(99));
    expect(result.current.page).toBe(3);
    expect(result.current.pageData.map((r) => r.id)).toEqual([21, 22, 23, 24, 25]);
  });

  it('clamps the initial defaultPage too', () => {
    const { result } = renderHook(() =>
      useTablePagination({ data, pageSize: 10, defaultPage: 99 }),
    );
    expect(result.current.page).toBe(3);
  });

  it('clamps page down when data shrinks below the current page range', () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: typeof data }) => useTablePagination({ data: items, pageSize: 10 }),
      { initialProps: { items: data } },
    );
    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);

    rerender({ items: data.slice(0, 5) });
    expect(result.current.page).toBe(1);
    expect(result.current.pageData.map((r) => r.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('totalPages is at least 1 even when data is empty', () => {
    const { result } = renderHook(() => useTablePagination({ data: [], pageSize: 10 }));
    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(1);
    expect(result.current.pageData).toEqual([]);
  });

  it('calls onPageChange when setPage is invoked', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10, onPageChange }));
    act(() => result.current.setPage(2));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('is controlled when page is provided — internal state does not change', () => {
    const onPageChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ page }: { page: number }) =>
        useTablePagination({ data, pageSize: 10, page, onPageChange }),
      { initialProps: { page: 1 } },
    );
    expect(result.current.page).toBe(1);

    act(() => result.current.setPage(2));
    expect(onPageChange).toHaveBeenCalledWith(2);
    // Controlled: prop unchanged, page stays put despite the setPage call.
    expect(result.current.page).toBe(1);

    rerender({ page: 2 });
    expect(result.current.page).toBe(2);
    expect(result.current.pageData.map((r) => r.id)).toEqual([
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
  });

  it('clamps a controlled page value passed out of range', () => {
    const { result } = renderHook(() => useTablePagination({ data, pageSize: 10, page: 99 }));
    expect(result.current.page).toBe(3);
    expect(result.current.pageData.map((r) => r.id)).toEqual([21, 22, 23, 24, 25]);
  });
});
