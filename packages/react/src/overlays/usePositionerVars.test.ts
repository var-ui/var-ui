import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { usePositionerVars } from './usePositionerVars';

describe('usePositionerVars', () => {
  it('derives bottom placement CSS variables from the popup bounds', () => {
    const popup = document.createElement('div');
    popup.getBoundingClientRect = () =>
      ({
        top: 120,
        bottom: 320,
        left: 0,
        right: 200,
        width: 200,
        height: 200,
        x: 0,
        y: 120,
        toJSON: () => ({}),
      }) as DOMRect;
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
});
