import { describe, expect, it, vi } from 'vite-plus/test';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  it('reflects matchMedia state', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(min-width: 600px)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));
    expect(result.current).toBe(true);
    const { result: narrow } = renderHook(() => useMediaQuery('(min-width: 2000px)'));
    expect(narrow.current).toBe(false);
    vi.unstubAllGlobals();
  });
});
