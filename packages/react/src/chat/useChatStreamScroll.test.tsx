import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useChatStreamScroll } from './useChatStreamScroll';

function mockScrollMetrics(
  el: HTMLElement,
  {
    scrollTop,
    scrollHeight,
    clientHeight,
  }: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  },
) {
  Object.defineProperty(el, 'scrollTop', { value: scrollTop, writable: true, configurable: true });
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true });
}

describe('useChatStreamScroll', () => {
  it('starts locked and unlocked-state-false', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 0, scrollHeight: 100, clientHeight: 100 });
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));
    expect(result.current.isLocked).toBe(true);
    expect(result.current.isScrolledUp).toBe(false);
  });

  it('unlocks when the user scrolls up', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 500, scrollHeight: 1000, clientHeight: 200 });
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));

    mockScrollMetrics(el, { scrollTop: 300, scrollHeight: 1000, clientHeight: 200 });
    act(() => {
      el.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isLocked).toBe(false);
    expect(result.current.isScrolledUp).toBe(true);
  });

  it('re-locks once scrolled back within lockThreshold of the bottom', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 300, scrollHeight: 1000, clientHeight: 200 });
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));

    act(() => {
      mockScrollMetrics(el, { scrollTop: 100, scrollHeight: 1000, clientHeight: 200 });
      el.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isLocked).toBe(false);

    act(() => {
      mockScrollMetrics(el, { scrollTop: 795, scrollHeight: 1000, clientHeight: 200 });
      el.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isLocked).toBe(true);
  });

  it('scrollToBottom locks and calls scrollTo', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 100, scrollHeight: 1000, clientHeight: 200 });
    const scrollTo = vi.fn();
    el.scrollTo = scrollTo;
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));

    act(() => {
      mockScrollMetrics(el, { scrollTop: 100, scrollHeight: 1000, clientHeight: 200 });
      el.dispatchEvent(new Event('scroll'));
    });
    act(() => {
      result.current.scrollToBottom();
    });
    expect(result.current.isLocked).toBe(true);
    expect(scrollTo).toHaveBeenCalledWith({ top: 800, behavior: 'smooth' });
  });
});
