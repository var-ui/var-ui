import { useEffect } from 'react';

/** Locks body scroll while `locked` is true; restores the previous overflow on cleanup. */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
