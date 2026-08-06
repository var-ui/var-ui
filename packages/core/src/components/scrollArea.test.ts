import { describe, expect, it } from 'vite-plus/test';
import { resolveScrollAreaFade } from './scrollArea';

describe('resolveScrollAreaFade', () => {
  it('returns none when fade is disabled', () => {
    expect(resolveScrollAreaFade(false, 'vertical')).toBe('none');
    expect(resolveScrollAreaFade(undefined, 'vertical')).toBe('none');
  });

  it('maps boolean fade to the scroll orientation', () => {
    expect(resolveScrollAreaFade(true, 'vertical')).toBe('vertical');
    expect(resolveScrollAreaFade(true, 'horizontal')).toBe('horizontal');
    expect(resolveScrollAreaFade(true, 'both')).toBe('both');
  });

  it('passes explicit fade modes through', () => {
    expect(resolveScrollAreaFade('horizontal', 'vertical')).toBe('horizontal');
    expect(resolveScrollAreaFade('both', 'vertical')).toBe('both');
  });
});
