import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { badge } from '../../src/components/badge';
import { button, resolveButtonProps } from '../../src/components/button';

describe('button', () => {
  it('registers tone and appearance variants including danger', () => {
    button(resolveButtonProps({ tone: 'accent', appearance: 'filled' }));
    button(resolveButtonProps({ tone: 'danger', appearance: 'filled' }));
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-button[data-tone="accent"]');
    expect(css).toContain('.var-ui-button[data-tone="danger"]');
    expect(css).toContain('[data-appearance="filled"]');
    expect(css).toContain('var(--var-ui-color-tone-danger-background)');
  });

  it('maps intent shorthand to tone and appearance', () => {
    button(resolveButtonProps({ intent: 'primary' }));
    button(resolveButtonProps({ intent: 'outline' }));
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-button[data-tone="accent"]');
    expect(css).toContain('[data-appearance="outline"]');
  });

  it('applies elevation shadow when elevated is true', () => {
    button(resolveButtonProps({ elevated: true }));
    const css = getRegisteredCss();
    expect(css).toContain('[data-elevated]');
    expect(css).toContain('var(--var-ui-shadow-md)');
  });
});

describe('badge appearance', () => {
  it('registers tone and appearance variants', () => {
    badge({ tone: 'accent', appearance: 'solid' });
    const css = getRegisteredCss();
    expect(css).toContain('.var-ui-badge[data-tone="accent"]');
    expect(css).toContain('[data-appearance="solid"]');
  });
});
