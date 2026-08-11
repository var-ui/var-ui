import { useEffect, useState } from 'react';

/**
 * Debounce a value — Mantine `useDebouncedValue` equivalent.
 *
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
