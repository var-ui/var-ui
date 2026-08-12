import { describe, expect, it } from 'vite-plus/test';
import { componentDocsSchema } from './schema';

describe('componentDocsSchema', () => {
  it('requires title', () => {
    expect(componentDocsSchema().safeParse({}).success).toBe(false);
    expect(componentDocsSchema().parse({ title: 'Button' }).title).toBe('Button');
  });

  it('defaults tableOfContents to true', () => {
    expect(componentDocsSchema().parse({ title: 'Button' }).tableOfContents).toBe(true);
  });
});
