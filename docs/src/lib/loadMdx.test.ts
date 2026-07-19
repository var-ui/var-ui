import { describe, expect, it } from 'vite-plus/test';
import { findMdxModule } from './loadMdx';

describe('findMdxModule', () => {
  it('resolves a slug to the matching glob loader', async () => {
    const modules = {
      '../../../content/components/button.mdx': async () => ({
        frontmatter: { title: 'Button' },
        Content: 'ok',
      }),
      '../../../content/components/alert.mdx': async () => ({
        frontmatter: { title: 'Alert' },
        Content: 'nope',
      }),
    };

    const loader = findMdxModule(modules, 'button');
    expect(loader).toBeTypeOf('function');
    await expect(loader!()).resolves.toMatchObject({ frontmatter: { title: 'Button' } });
  });

  it('returns undefined when the slug is missing', () => {
    expect(findMdxModule({}, 'button')).toBeUndefined();
  });
});
