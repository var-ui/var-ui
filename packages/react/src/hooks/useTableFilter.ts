import { useCallback, useMemo, useState } from 'react';

export type UseTableFilterOptions<T> = {
  data: T[];
  /** Controlled search query. */
  query?: string;
  /** Uncontrolled initial query. @default '' */
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Row keys to search. Default: all own string keys on `T`. */
  searchKeys?: (keyof T & string)[];
  /** Custom matcher. Default: case-insensitive substring across `searchKeys`. */
  filterFn?: (row: T, query: string) => boolean;
};

export type UseTableFilterResult<T> = {
  filteredData: T[];
  query: string;
  onQueryChange: (query: string) => void;
};

function defaultSearchKeys<T>(data: T[]): (keyof T & string)[] {
  const sample = data[0];
  if (sample == null || typeof sample !== 'object') return [];
  return Object.keys(sample) as (keyof T & string)[];
}

function defaultFilterFn<T>(row: T, query: string, searchKeys: (keyof T & string)[]): boolean {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) return true;
  return searchKeys.some((key) => {
    const value = (row as Record<string, unknown>)[key];
    if (value == null) return false;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value.toString().toLowerCase().includes(normalized);
    }
    return false;
  });
}

/**
 * Headless global search state for tables: uncontrolled (`defaultQuery`) or
 * controlled (`query` + `onQueryChange`), with a pluggable matcher. No DOM —
 * pair with `SearchInput` and `useTableSort`.
 */
export function useTableFilter<T>(options: UseTableFilterOptions<T>): UseTableFilterResult<T> {
  const {
    data,
    defaultQuery = '',
    query,
    onQueryChange,
    searchKeys: searchKeysOption,
    filterFn,
  } = options;
  const isControlled = query !== undefined;

  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const resolvedQuery = isControlled ? query : internalQuery;

  const searchKeys = useMemo(
    () => searchKeysOption ?? defaultSearchKeys(data),
    [data, searchKeysOption],
  );

  const handleQueryChange = useCallback(
    (next: string) => {
      if (!isControlled) setInternalQuery(next);
      onQueryChange?.(next);
    },
    [isControlled, onQueryChange],
  );

  const filteredData = useMemo(() => {
    const matcher = filterFn ?? ((row: T, q: string) => defaultFilterFn(row, q, searchKeys));
    return data.filter((row) => matcher(row, resolvedQuery));
  }, [data, filterFn, resolvedQuery, searchKeys]);

  return { filteredData, query: resolvedQuery, onQueryChange: handleQueryChange };
}
