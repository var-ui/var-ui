// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { segmentedControl } from '../src/components/segmentedControl';
import {
  getActiveSegmentedControlSegment,
  observeSegmentedControlIndicator,
  positionSegmentedControlIndicator,
  segmentedControlIndicatorCssVars,
  syncSegmentedControlIndicator,
} from '../src/segmentedControlIndicator';

describe('positionSegmentedControlIndicator', () => {
  it('uses CSS var names that match the segmented-control recipe', () => {
    segmentedControl();
    const css = getRegisteredCss();
    for (const name of Object.values(segmentedControlIndicatorCssVars)) {
      expect(css).toContain(name);
    }
    expect(css).toContain('.var-ui-segmented-control');
    expect(css).toMatch(/\.var-ui-segmented-control[^}]*background-color:/);
  });

  it('positions the indicator to match the active segment', () => {
    const root = document.createElement('div');

    const segment = document.createElement('button');
    segment.setAttribute('data-selected', '');
    Object.defineProperty(segment, 'offsetLeft', { value: 24, configurable: true });
    Object.defineProperty(segment, 'offsetWidth', { value: 80, configurable: true });
    root.append(segment);

    positionSegmentedControlIndicator(root, segment);

    expect(root.style.getPropertyValue(segmentedControlIndicatorCssVars.x)).toBe('24px');
    expect(root.style.getPropertyValue(segmentedControlIndicatorCssVars.width)).toBe('80px');
    expect(root.style.getPropertyValue(segmentedControlIndicatorCssVars.opacity)).toBe('1');
  });

  it('hides the indicator when there is no active segment', () => {
    const root = document.createElement('div');

    positionSegmentedControlIndicator(root, null);

    expect(root.style.getPropertyValue(segmentedControlIndicatorCssVars.opacity)).toBe('0');
  });

  it('ignores zero-width segments until layout is ready', () => {
    const root = document.createElement('div');
    const segment = document.createElement('button');
    segment.setAttribute('data-selected', '');
    Object.defineProperty(segment, 'offsetLeft', { value: 12, configurable: true });
    Object.defineProperty(segment, 'offsetWidth', { value: 0, configurable: true });
    root.append(segment);

    positionSegmentedControlIndicator(root, segment);

    expect(root.style.getPropertyValue(segmentedControlIndicatorCssVars.opacity)).toBe('');
  });
});

describe('getActiveSegmentedControlSegment', () => {
  it('prefers direct child segments with data-selected', () => {
    const root = document.createElement('div');
    const active = document.createElement('button');
    active.setAttribute('data-selected', '');
    const inactive = document.createElement('button');
    root.append(active, inactive);

    expect(getActiveSegmentedControlSegment(root)).toBe(active);
  });
});

describe('observeSegmentedControlIndicator', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('positions after layout via requestAnimationFrame', () => {
    class ResizeObserverMock {
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });

    const root = document.createElement('div');
    const segment = document.createElement('button');
    segment.setAttribute('data-selected', '');
    Object.defineProperty(segment, 'offsetLeft', { value: 8, configurable: true });
    Object.defineProperty(segment, 'offsetWidth', { value: 40, configurable: true });
    root.append(segment);

    const cleanup = observeSegmentedControlIndicator(root);
    syncSegmentedControlIndicator(root);

    expect(root.style.getPropertyValue(segmentedControlIndicatorCssVars.width)).toBe('40px');
    cleanup();
  });
});
