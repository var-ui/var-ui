import { describe, expect, it } from 'vite-plus/test';
import { docsSchema, guideFrontmatterSchema, themingSchema } from './schema';

describe('guideFrontmatterSchema', () => {
  it('requires title and applies defaults', () => {
    const parsed = guideFrontmatterSchema.parse({ title: 'Getting started' });
    expect(parsed.title).toBe('Getting started');
    expect(parsed.template).toBe('guide');
    expect(parsed.tableOfContents).toBe(true);
    expect(parsed.wide).toBe(false);
  });

  it('accepts wide + description via docsSchema()', () => {
    const parsed = docsSchema().parse({
      title: 'Colors',
      description: 'Palette ramps',
      wide: true,
    });
    expect(parsed.wide).toBe(true);
    expect(parsed.description).toBe('Palette ramps');
  });

  it('rejects missing title via themingSchema()', () => {
    expect(themingSchema().safeParse({}).success).toBe(false);
  });
});
