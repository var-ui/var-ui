import { describe, expect, it } from 'vite-plus/test';
import { recipeClassName, recipeProps, type RecipeClass } from './utils';

describe('recipeProps', () => {
  it('merges a string recipe with className', () => {
    expect(recipeProps('btn', 'extra')).toEqual({ className: expect.stringContaining('btn') });
  });

  it('spreads attrs from a ComponentAttrsResult-like object', () => {
    const result = recipeProps(
      { className: 'root', attrs: { 'data-intent': 'primary' } } as unknown as RecipeClass,
      'x',
    );
    expect(result.className).toMatch(/root/);
    expect(result['data-intent']).toBe('primary');
  });
});

describe('recipeClassName', () => {
  it('returns class string from attrs result', () => {
    expect(recipeClassName({ className: 'a', attrs: {} } as unknown as RecipeClass, 'b')).toMatch(
      /a/,
    );
  });
});
