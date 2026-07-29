import { describe, expect, it } from 'vite-plus/test';
import { resolveActiveHeading } from '../src/tocSpy';

describe('resolveActiveHeading', () => {
  it('prefers the last intersecting heading in document order', () => {
    const intersecting = new Map([
      ['examples', true],
      ['default', true],
      ['props', false],
    ]);

    expect(resolveActiveHeading(['examples', 'default', 'props'], intersecting, null)).toBe(
      'default',
    );
  });
});
