'use client';

import { recipeClassName } from '@var-ui/react';
import { useMemo, type ReactNode } from 'react';
import { proseContent } from '@var-ui/core';
import { MDXContent } from '@content-collections/mdx/react';
import type { ComponentPropsDoc } from '@/lib/extract-component-props';
import type { DocHeading } from '@/lib/extract-headings';
import { docsContent } from '@/styles/docsContent';
import { DocsChrome } from './DocsChrome';
import { mdxComponents } from './mdx-components';
import { PropsTable } from './PropsTable';

type DocPageProps = {
  children?: ReactNode;
  headings?: DocHeading[];
  mdx?: string;
  propsDoc?: ComponentPropsDoc | null;
};

export function DocsPageLayout({ children, headings = [], mdx, propsDoc }: DocPageProps) {
  const content = docsContent();
  const prose = proseContent();
  const components = useMemo(
    () => ({
      ...mdxComponents,
      PropsTable: (props: { slug: string }) => <PropsTable {...props} doc={propsDoc} />,
    }),
    [propsDoc],
  );

  return (
    <DocsChrome headings={headings}>
      <div className={recipeClassName(content.article)}>
        {mdx ? (
          <article className={recipeClassName(prose.root)}>
            <MDXContent code={mdx} components={components} />
          </article>
        ) : (
          <article className={recipeClassName(prose.root)}>{children}</article>
        )}
      </div>
    </DocsChrome>
  );
}
