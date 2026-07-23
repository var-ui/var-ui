import { describe, expect, it } from 'vite-plus/test';
import { breakpointValues, zIndexValues } from './layout';

describe('layout token values', () => {
  it('defines breakpoint sm/md/lg/xl in px', () => {
    expect(breakpointValues.md).toBe('768px');
  });

  it('maps overlay/toast/modal z-index stack', () => {
    expect(zIndexValues.overlay).toBeLessThan(zIndexValues.toast);
    expect(zIndexValues.toast).toBeLessThan(zIndexValues.modal);
  });
});
