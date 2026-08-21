import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { usePositionerVars } from './usePositionerVars';

function rect(top: number, width = 200): DOMRect {
  return {
    top,
    bottom: top + 200,
    left: 0,
    right: width,
    width,
    height: 200,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('usePositionerVars', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('derives bottom placement CSS variables from the popup bounds', () => {
    const popup = document.createElement('div');
    popup.getBoundingClientRect = () => rect(120);
    const popupRef = { current: popup };

    const { result } = renderHook(() =>
      usePositionerVars({
        placement: 'bottom',
        popupRef,
      }),
    );

    expect(result.current.style['--var-ui-transform-origin']).toBe('top center');
    expect(result.current.style['--var-ui-available-height']).toMatch(/px$/);
  });

  it('returns a zero anchor width whenever a supplied trigger ref is empty', () => {
    const popup = document.createElement('div');
    popup.getBoundingClientRect = () => rect(120);
    const popupRef: { current: HTMLElement | null } = { current: null };
    const triggerRef: { current: HTMLElement | null } = { current: null };
    const { result, rerender } = renderHook(() =>
      usePositionerVars({
        placement: 'bottom',
        popupRef,
        triggerRef,
      }),
    );

    expect(result.current.style['--var-ui-anchor-width']).toBe('0px');

    popupRef.current = popup;
    rerender();

    expect(result.current.style['--var-ui-anchor-width']).toBe('0px');
  });

  it('measures and observes popup elements added or replaced through a stable ref', () => {
    class TestResizeObserver {
      static instances: TestResizeObserver[] = [];
      observed: Element | null = null;

      constructor(private readonly callback: ResizeObserverCallback) {
        TestResizeObserver.instances.push(this);
      }

      observe(target: Element) {
        this.observed = target;
      }

      disconnect() {
        this.observed = null;
      }

      notify(target: Element) {
        if (this.observed === target) {
          this.callback([], this as unknown as ResizeObserver);
        }
      }
    }
    vi.stubGlobal('ResizeObserver', TestResizeObserver);

    const popupRef: { current: HTMLElement | null } = { current: null };
    const { result, rerender } = renderHook(() =>
      usePositionerVars({
        placement: 'bottom',
        popupRef,
      }),
    );
    expect(result.current.style['--var-ui-available-height']).toBe('0px');

    const firstPopup = document.createElement('div');
    firstPopup.getBoundingClientRect = () => rect(120);
    popupRef.current = firstPopup;
    rerender();
    expect(result.current.style['--var-ui-available-height']).toBe(`${window.innerHeight - 120}px`);

    let replacementTop = 240;
    const replacementPopup = document.createElement('div');
    replacementPopup.getBoundingClientRect = () => rect(replacementTop);
    popupRef.current = replacementPopup;
    rerender();
    expect(result.current.style['--var-ui-available-height']).toBe(`${window.innerHeight - 240}px`);

    replacementTop = 320;
    act(() => {
      TestResizeObserver.instances[TestResizeObserver.instances.length - 1]?.notify(
        replacementPopup,
      );
    });
    expect(result.current.style['--var-ui-available-height']).toBe(`${window.innerHeight - 320}px`);
  });
});
