import { describe, expect, it } from 'vite-plus/test';
import { iconMirrorStyle } from './icon';

describe('iconMirrorStyle', () => {
  it('flips on data-mirror', () => {
    expect(iconMirrorStyle['&[data-mirror]']).toEqual({ transform: 'scaleX(-1)' });
  });
});
