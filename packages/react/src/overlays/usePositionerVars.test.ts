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

  it('measures available height from the trigger and viewport, not the popup rect', () => {
    const trigger = document.createElement('button');
    trigger.getBoundingClientRect = () => rect(400, 80);
    const popup = document.createElement('div');
    popup.getBoundingClientRect = () => rect(80, 240);

    const { result } = renderHook(() =>
      usePositionerVars({
        placement: 'top',
        popupRef: { current: popup },
        triggerRef: { current: trigger },
      }),
    );

    expect(result.current.style['--var-ui-available-height']).toBe('400px');
    expect(result.current.style['--var-ui-transform-origin']).toBe('bottom center');
  });

  it('does not remasure on rerender when the observed nodes are unchanged', () => {
    const trigger = document.createElement('button');
    const getRect = vi.fn<() => DOMRect>(() => rect(120, 80));
    trigger.getBoundingClientRect = getRect;
    const popupRef = { current: document.createElement('div') };
    const triggerRef = { current: trigger };

    const { rerender } = renderHook(() =>
      usePositionerVars({
        placement: 'bottom',
        popupRef,
        triggerRef,
      }),
    );
    const callsAfterMount = getRect.mock.calls.length;
    rerender();
    rerender();
    expect(getRect.mock.calls.length).toBe(callsAfterMount);
  });

  it('measures and observes popup elements added or replaced through a stable ref', () => {
    class TestResizeObserver {
      static instances: TestResizeObserver[] = [];
      observed = new Set<Element>();

      constructor(private readonly callback: ResizeObserverCallback) {
        TestResizeObserver.instances.push(this);
      }

      observe(target: Element) {
        this.observed.add(target);
      }

      disconnect() {
        this.observed.clear();
      }

      notify(target: Element) {
        if (this.observed.has(target)) {
          this.callback([], this as unknown as ResizeObserver);
        }
      }
    }
    vi.stubGlobal('ResizeObserver', TestResizeObserver);

    const popupRef: { current: HTMLElement | null } = { current: null };
    const triggerRef: { current: HTMLElement | null } = { current: null };
    const { result, rerender } = renderHook(() =>
      usePositionerVars({
        placement: 'bottom',
        popupRef,
        triggerRef,
      }),
    );
    expect(result.current.style['--var-ui-available-height']).toBe('0px');

    const firstPopup = document.createElement('div');
    const firstTrigger = document.createElement('button');
    firstTrigger.getBoundingClientRect = () => rect(120);
    popupRef.current = firstPopup;
    triggerRef.current = firstTrigger;
    rerender();
    expect(result.current.style['--var-ui-available-height']).toBe(`${window.innerHeight - 320}px`);

    let replacementTop = 240;
    const replacementPopup = document.createElement('div');
    const replacementTrigger = document.createElement('button');
    replacementTrigger.getBoundingClientRect = () => rect(replacementTop);
    popupRef.current = replacementPopup;
    triggerRef.current = replacementTrigger;
    rerender();
    expect(result.current.style['--var-ui-available-height']).toBe(`${window.innerHeight - 440}px`);

    replacementTop = 320;
    act(() => {
      TestResizeObserver.instances[TestResizeObserver.instances.length - 1]?.notify(
        replacementTrigger,
      );
    });
    expect(result.current.style['--var-ui-available-height']).toBe(`${window.innerHeight - 520}px`);
  });
});
