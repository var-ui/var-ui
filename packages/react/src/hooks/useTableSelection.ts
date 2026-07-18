import { useCallback, useMemo, useState } from 'react';

export type SelectionMode = 'single' | 'multiple';

export type UseTableSelectionOptions<T> = {
  data: T[];
  getRowId: (row: T) => string;
  mode: SelectionMode;
  defaultSelectedKeys?: Iterable<string>;
  selectedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string>) => void;
};

export type UseTableSelectionResult = {
  selectedKeys: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  selectAll: () => void;
  clear: () => void;
  onSelectionChange: (keys: Set<string>) => void;
};

/**
 * Headless row-selection state for tables: single or multiple selection,
 * uncontrolled (`defaultSelectedKeys`) or controlled (`selectedKeys` +
 * `onSelectionChange`). No DOM — key identity is caller-supplied via `getRowId`.
 */
export function useTableSelection<T>(
  options: UseTableSelectionOptions<T>,
): UseTableSelectionResult {
  const { data, getRowId, mode, defaultSelectedKeys, selectedKeys, onSelectionChange } = options;
  const isControlled = selectedKeys !== undefined;

  const [internalKeys, setInternalKeys] = useState<Set<string>>(
    () => new Set(defaultSelectedKeys ?? []),
  );
  const resolvedKeys = isControlled ? new Set(selectedKeys) : internalKeys;

  const commit = useCallback(
    (next: Set<string>) => {
      if (!isControlled) setInternalKeys(next);
      onSelectionChange?.(next);
    },
    [isControlled, onSelectionChange],
  );

  const isSelected = useCallback((id: string) => resolvedKeys.has(id), [resolvedKeys]);

  const toggle = useCallback(
    (id: string) => {
      if (mode === 'single') {
        const next = resolvedKeys.has(id) ? new Set<string>() : new Set([id]);
        commit(next);
        return;
      }
      const next = new Set(resolvedKeys);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      commit(next);
    },
    [commit, mode, resolvedKeys],
  );

  const selectAll = useCallback(() => {
    if (mode === 'single') {
      const first = data[0];
      commit(first ? new Set([getRowId(first)]) : new Set<string>());
      return;
    }
    commit(new Set(data.map(getRowId)));
  }, [commit, data, getRowId, mode]);

  const clear = useCallback(() => commit(new Set<string>()), [commit]);

  return useMemo(
    () => ({
      selectedKeys: resolvedKeys,
      isSelected,
      toggle,
      selectAll,
      clear,
      onSelectionChange: commit,
    }),
    [resolvedKeys, isSelected, toggle, selectAll, clear, commit],
  );
}
