import { describe, expect, it } from 'vite-plus/test';
import { color } from './color';
import { defaultColorTokenValues } from './default-color-values';
import { colorTokens } from './register';

describe('color tokens', () => {
  it('declares the full color namespace', () => {
    expect(String(color.text.primary)).toMatch(/var\(--var-ui-color-text-primary\)/);
  });

  it('registers every derived color leaf', () => {
    expect(defaultColorTokenValues.overlay.hover).toMatch(/color-mix|var\(--/);
    expect(defaultColorTokenValues.ring.default).toBeTruthy();
    expect(defaultColorTokenValues.skeleton.default).toBeTruthy();
    expect(defaultColorTokenValues.track.default).toBeTruthy();
    expect(colorTokens.overlay.hover).toBeTruthy();
    expect(colorTokens.link.default).toBeTruthy();
  });
});
