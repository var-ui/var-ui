import { useCallback, useMemo, useState } from 'react';

export type UseTablePaginationOptions<T> = {
  data: T[];
  pageSize: number;
  page?: number; // 1-based controlled
  defaultPage?: number;
  onPageChange?: (page: number) => void;
};

export type UseTablePaginationResult<T> = {
  pageData: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
};

function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), totalPages);
}

/**
 * Headless pagination state for tables: uncontrolled (`defaultPage`) or
 * controlled (`page` + `onPageChange`). Clamps to `[1, totalPages]` — on the
 * initial value, on `setPage`, and whenever `data`/`pageSize` shrink the
 * valid range out from under the current page. No DOM.
 */
export function useTablePagination<T>(
  options: UseTablePaginationOptions<T>,
): UseTablePaginationResult<T> {
  const { data, pageSize, page, defaultPage = 1, onPageChange } = options;
  const isControlled = page !== undefined;

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const [internalPage, setInternalPage] = useState<number>(defaultPage);
  const rawPage = isControlled ? page : internalPage;
  const resolvedPage = clampPage(rawPage, totalPages);

  const setPage = useCallback(
    (next: number) => {
      const clamped = clampPage(next, totalPages);
      if (!isControlled) setInternalPage(clamped);
      onPageChange?.(clamped);
    },
    [isControlled, onPageChange, totalPages],
  );

  const pageData = useMemo(() => {
    const start = (resolvedPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pageSize, resolvedPage]);

  return { pageData, page: resolvedPage, pageSize, totalPages, setPage };
}
