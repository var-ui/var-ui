import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { useOverlayPresence } from './useOverlayPresence';

function elementWithAnimation(finished: Promise<void>): HTMLElement {
  const element = document.createElement('div');
  element.getAnimations = () => [{ finished, cancel: () => {} }] as unknown as Animation[];
  return element;
}

describe('useOverlayPresence', () => {
  let frameCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    frameCallbacks = [];
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frameCallbacks.push(callback);
        return frameCallbacks.length;
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('mounts with open attrs and clears starting style after two frames', () => {
    const { result } = renderHook(() =>
      useOverlayPresence({
        isOpen: true,
        reducedMotion: true,
        getAnimatedElements: () => [],
      }),
    );

    expect(result.current).toEqual({
      mounted: true,
      attrs: {
        'data-open': '',
        'data-starting-style': '',
      },
    });

    act(() => {
      frameCallbacks.shift()?.(0);
    });
    expect(result.current.attrs['data-starting-style']).toBe('');

    act(() => {
      frameCallbacks.shift()?.(16);
    });
    expect(result.current.attrs['data-starting-style']).toBeUndefined();
    expect(result.current.attrs['data-open']).toBe('');
  });

  it('stays mounted with exit attrs while animations run', async () => {
    let resolve!: () => void;
    const finished = new Promise<void>((finish) => {
      resolve = finish;
    });
    const element = elementWithAnimation(finished);
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          reducedMotion: false,
          getAnimatedElements: () => [element],
        }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    expect(result.current).toEqual({
      mounted: true,
      attrs: {
        'data-open': '',
        'data-closed': '',
        'data-ending-style': '',
      },
    });

    await act(async () => {
      resolve();
      await finished;
    });
    expect(result.current.mounted).toBe(false);
  });

  it('unmounts immediately for reduced motion', () => {
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          reducedMotion: true,
          getAnimatedElements: () => [],
        }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    expect(result.current.mounted).toBe(false);
  });

  it('defaults reduced motion from the media query', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          getAnimatedElements: () => [elementWithAnimation(new Promise(() => {}))],
        }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(result.current.mounted).toBe(false);
  });

  it('unmounts immediately when elements are null or have no animations', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'getAnimations', { value: undefined });
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          reducedMotion: false,
          getAnimatedElements: () => [null, element],
        }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });

    expect(result.current.mounted).toBe(false);
  });

  it('cancels a stale exit when reopened', async () => {
    let resolve!: () => void;
    const finished = new Promise<void>((finish) => {
      resolve = finish;
    });
    const element = elementWithAnimation(finished);
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          reducedMotion: false,
          getAnimatedElements: () => [element],
        }),
      { initialProps: { isOpen: true } },
    );

    rerender({ isOpen: false });
    rerender({ isOpen: true });

    expect(result.current.mounted).toBe(true);
    expect(result.current.attrs['data-ending-style']).toBeUndefined();
    expect(result.current.attrs['data-closed']).toBeUndefined();

    await act(async () => {
      resolve();
      await finished;
    });
    expect(result.current.mounted).toBe(true);
  });
});
