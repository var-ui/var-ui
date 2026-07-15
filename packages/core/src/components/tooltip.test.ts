import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { tooltip } from './tooltip';

describe('tooltip', () => {
  it('registers root styles', () => {
    tooltip();
    expect(getRegisteredCss()).toContain('var-ui-tooltip-root');
  });
});
