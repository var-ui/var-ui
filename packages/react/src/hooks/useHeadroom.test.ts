import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { useHeadroom } from './useHeadroom';

describe('useHeadroom', () => {
  it('stays pinned near the top of the scroll container', () => {
    const target = document.createElement('main');
    Object.defineProperty(target, 'scrollTop', { value: 0, writable: true, configurable: true });
    const targetRef = { current: target };

    const { result } = renderHook(() => useHeadroom({ target: targetRef, fixedAt: 80 }));

    act(() => {
      target.scrollTop = 40;
      target.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.pinned).toBe(true);
  });

  it('unpins when scrolling down past fixedAt', () => {
    const target = document.createElement('main');
    Object.defineProperty(target, 'scrollTop', { value: 0, writable: true, configurable: true });
    const targetRef = { current: target };

    const { result } = renderHook(() => useHeadroom({ target: targetRef, fixedAt: 80 }));

    act(() => {
      target.scrollTop = 120;
      target.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.pinned).toBe(false);

    act(() => {
      target.scrollTop = 100;
      target.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.pinned).toBe(true);
  });
});
