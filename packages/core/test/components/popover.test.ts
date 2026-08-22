import { describe, expect, it } from 'vite-plus/test';
import { popover } from '../../src/components/popover';

describe('popover', () => {
  it('preserves the public root class name', () => {
    const classes = popover();

    expect(classes.root).toBeTruthy();
    expect(classes.root).toContain('var-ui-popover');
  });
});
