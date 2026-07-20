import { describe, expect, it } from 'vite-plus/test';
import { getHtmlApiDoc } from './html-api-docs';

describe('html-api-docs', () => {
  it('documents button class and data attributes', () => {
    const doc = getHtmlApiDoc('button');
    expect(doc?.recipeName).toBe('button');
    expect(doc?.parts[0]?.className).toBe('var-ui-button');
    const names = doc?.parts[0]?.attributes.map((a) => a.name) ?? [];
    expect(names).toEqual(expect.arrayContaining(['data-intent', 'data-size', 'data-layout']));
  });

  it('documents compound alert parts', () => {
    const doc = getHtmlApiDoc('alert');
    expect(doc?.parts.some((p) => p.part === 'root' && p.className === 'var-ui-alert')).toBe(true);
    expect(doc?.parts.some((p) => p.part === 'title')).toBe(true);
  });

  it('returns null for unknown slugs', () => {
    expect(getHtmlApiDoc('not-a-real-component')).toBeNull();
  });
});
