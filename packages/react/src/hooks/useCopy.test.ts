import { describe, expect, it, vi, beforeEach, afterEach } from 'vite-plus/test';
import { renderHook, act } from '@testing-library/react';
import { useCopy } from './useCopy';

describe('useCopy', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('sets copied after a successful write', async () => {
    const { result } = renderHook(() => useCopy({ timeout: 1000 }));

    await act(async () => {
      await result.current.copy('hello');
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('resets copied after the timeout', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCopy({ timeout: 500 }));

    await act(async () => {
      await result.current.copy('hello');
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.copied).toBe(false);
  });
});
