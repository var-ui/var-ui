import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'ascending' | 'descending';
export type SortDescriptor = { column: string; direction: SortDirection };

export type UseTableSortOptions<T> = {
  data: T[];
  /** Default / uncontrolled initial sort. */
  defaultSort?: SortDescriptor;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (next: SortDescriptor) => void;
  /** Per-column comparators; default: string/number coerce on `row[column]`. */
  getSortValue?: (row: T, column: string) => string | number | boolean | null | undefined;
};

export type UseTableSortResult<T> = {
  sortedData: T[];
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: (next: SortDescriptor) => void;
};

function defaultGetSortValue<T>(
  row: T,
  column: string,
): string | number | boolean | null | undefined {
  return (row as Record<string, unknown>)[column] as string | number | boolean | null | undefined;
}

function compareValues(a: string | number | boolean, b: string | number | boolean): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/**
 * Headless sort state for tables: uncontrolled (`defaultSort`) or controlled
 * (`sortDescriptor` + `onSortChange`), with a pluggable per-column value getter.
 * No DOM — safe for both `Table` and any custom list/grid.
 */
export function useTableSort<T>(options: UseTableSortOptions<T>): UseTableSortResult<T> {
  const {
    data,
    defaultSort,
    sortDescriptor,
    onSortChange,
    getSortValue = defaultGetSortValue,
  } = options;
  const isControlled = sortDescriptor !== undefined;

  const [internalSort, setInternalSort] = useState<SortDescriptor | undefined>(defaultSort);
  const resolvedSort = isControlled ? sortDescriptor : internalSort;

  const handleSortChange = useCallback(
    (next: SortDescriptor) => {
      if (!isControlled) setInternalSort(next);
      onSortChange?.(next);
    },
    [isControlled, onSortChange],
  );

  const sortedData = useMemo(() => {
    if (!resolvedSort) return data;
    const { column, direction } = resolvedSort;
    const sign = direction === 'ascending' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getSortValue(a, column);
      const vb = getSortValue(b, column);
      const aNullish = va === null || va === undefined;
      const bNullish = vb === null || vb === undefined;
      if (aNullish && bNullish) return 0;
      if (aNullish) return 1;
      if (bNullish) return -1;
      return sign * compareValues(va, vb);
    });
  }, [data, resolvedSort, getSortValue]);

  return { sortedData, sortDescriptor: resolvedSort, onSortChange: handleSortChange };
}
