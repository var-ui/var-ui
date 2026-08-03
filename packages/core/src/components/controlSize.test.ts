import { describe, expect, it } from 'vite-plus/test';
import { controlSizeMetrics, controlSurfaceSize, segmentedControlSize } from './controlSize';

describe('controlSurfaceSize', () => {
  it('uses shared control height tokens for each size', () => {
    expect(controlSurfaceSize('sm').height).toBe(controlSizeMetrics.sm.height);
    expect(controlSurfaceSize('md').height).toBe(controlSizeMetrics.md.height);
    expect(controlSurfaceSize('lg').height).toBe(controlSizeMetrics.lg.height);
  });

  it('uses compact horizontal inset for input shells', () => {
    expect(controlSurfaceSize('md', { inset: 'compact' }).paddingInline).not.toBe(
      controlSurfaceSize('md').paddingInline,
    );
  });
});

describe('segmentedControlSize', () => {
  it('matches control height tokens on the track', () => {
    expect(segmentedControlSize('sm').root.height).toBe(controlSizeMetrics.sm.height);
    expect(segmentedControlSize('md').root.height).toBe(controlSizeMetrics.md.height);
  });

  it('adds horizontal inset to segments', () => {
    expect(segmentedControlSize('md').segment.paddingInline).toBe(
      controlSizeMetrics.md.paddingInline,
    );
  });
});
