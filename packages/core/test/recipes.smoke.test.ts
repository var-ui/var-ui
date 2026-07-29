import { describe, expect, it } from 'vite-plus/test';
import { themeableComponents } from '../src/themeable-components';

describe('recipe smoke', () => {
  it('invokes every themeable recipe without throwing', () => {
    for (const [name, recipe] of Object.entries(themeableComponents)) {
      if (typeof recipe === 'function') {
        expect(
          () => (recipe as (props?: object) => unknown)({}),
          `${name} should invoke`,
        ).not.toThrow();
      } else {
        expect(recipe, `${name} should be a registered class`).toBeTruthy();
      }
    }
  });
});
