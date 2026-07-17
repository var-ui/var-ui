import { describe, it, expect } from 'vite-plus/test';
import * as components from './components';
import { themeableComponents } from './themeable-components';

describe('themeableComponents registry', () => {
  it('includes every exported recipe function from components/', () => {
    const recipeExports = Object.entries(components).filter(
      ([name, value]) =>
        typeof value === 'function' &&
        // Skip non-recipe helpers re-exported from components
        !['layout', 'text', 'namedContainerQuery', 'codeHljsScope'].includes(name) &&
        !name.endsWith('Chrome') &&
        !name.startsWith('create'),
    );

    const missing: string[] = [];
    for (const [name, value] of recipeExports) {
      const registered = Object.values(themeableComponents).includes(
        value as (typeof themeableComponents)[keyof typeof themeableComponents],
      );
      if (!registered) missing.push(name);
    }

    expect(missing, `Add missing recipes to themeableComponents: ${missing.join(', ')}`).toEqual(
      [],
    );
  });
});
