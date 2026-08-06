import { describe, it, expect } from 'vite-plus/test';
import { buildToneFace, createToneFace } from '../../src/tokens/tone-face';

describe('buildToneFace', () => {
  it('derives subtleBackground and border from foreground alpha', () => {
    const face = buildToneFace({
      foreground: 'oklch(50% 0.2 250)',
      background: 'oklch(40% 0.2 250)',
      darkForeground: 'oklch(10% 0 0)',
    });

    expect(face.foreground).toBe('oklch(50% 0.2 250)');
    expect(face.subtleBackground).toContain('oklch');
    expect(face.border).toContain('oklch');
    expect(face.foregroundOnBackground).toBe('oklch(100% 0 0)');
  });
});

describe('createToneFace', () => {
  it('returns mode-aware leaves for every tone token', () => {
    const face = createToneFace({
      light: {
        foreground: 'oklch(50% 0.2 250)',
        background: 'oklch(40% 0.2 250)',
        darkForeground: 'oklch(10% 0 0)',
      },
      dark: {
        foreground: 'oklch(70% 0.15 250)',
        background: 'oklch(55% 0.15 250)',
        darkForeground: 'oklch(10% 0 0)',
      },
    });

    expect(face.foreground).toEqual({
      light: 'oklch(50% 0.2 250)',
      dark: 'oklch(70% 0.15 250)',
    });
    expect(face.background!.light).toBe('oklch(40% 0.2 250)');
    expect(face.background!.dark).toBe('oklch(55% 0.15 250)');
    expect(face.subtleBackground!.light).not.toBe(face.subtleBackground!.dark);
    expect(face.foregroundOnBackground!.light).toBe('oklch(100% 0 0)');
    expect(face.foregroundOnBackground!.dark).toBe('oklch(100% 0 0)');
  });
});
