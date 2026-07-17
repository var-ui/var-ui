import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { toast } from './toast';

describe('toast', () => {
  it('registers region/item slots, tone, and placement variants', () => {
    toast({ tone: 'success', placement: 'bottom-end' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-toast__region');
    expect(css).toContain('.var-ui-toast__item');
    expect(css).toContain('.var-ui-toast__item[data-tone="success"]');
    expect(css).toContain('.var-ui-toast__region[data-placement="bottom-end"]');
    expect(css).toContain('.var-ui-toast__close');
  });
});
