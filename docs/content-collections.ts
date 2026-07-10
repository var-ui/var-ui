import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineCollection, defineConfig } from '@content-collections/core';
import { bundleMDX } from 'mdx-bundler';
import { z } from 'zod';
import { extractHeadings } from './src/lib/extract-headings';

const docsRoot = path.dirname(fileURLToPath(import.meta.url));

const mdxSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
});

async function compileDocsMDX(content: string) {
  const { code } = await bundleMDX({
    source: content,
    cwd: docsRoot,
  });

  return code;
}

function createMdxCollection(name: string, directory: string) {
  return defineCollection({
    name,
    directory,
    include: '**/*.mdx',
    parser: 'frontmatter',
    schema: mdxSchema,
    transform: async (document) => {
      const mdx = await compileDocsMDX(document.content);

      return {
        ...document,
        slug: document._meta.path,
        mdx,
        headings: extractHeadings(document.content),
      };
    },
  });
}

const components = createMdxCollection('components', 'content/components');
const docs = createMdxCollection('docs', 'content/docs');
const theming = createMdxCollection('theming', 'content/theming');

export default defineConfig({
  content: [components, docs, theming],
});
