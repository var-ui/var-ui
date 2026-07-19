import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { collapsible } from './collapsible';

describe('collapsible', () => {
  it('registers root, trigger, triggerIcon, and panel slots', () => {
    collapsible();
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-collapsible');
    expect(css).toContain('.var-ui-collapsible__trigger');
    expect(css).toContain('.var-ui-collapsible__trigger-icon');
    expect(css).toContain('.var-ui-collapsible__panel');
  });

  it('rotates the trigger icon when the trigger is expanded', () => {
    collapsible();
    const css = getRegisteredCss();
    expect(css).toContain('[aria-expanded="true"]');
    expect(css).toContain('rotate');
  });
});
