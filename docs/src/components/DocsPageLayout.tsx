'use client';

import { recipeClassName } from '@var-ui/react';
import { useMemo, type ReactNode } from 'react';
import { proseContent } from '@var-ui/core';
import { MDXContent } from '@content-collections/mdx/react';
import type { ComponentPropsDoc } from '@/lib/extract-component-props';
import type { DocHeading } from '@/lib/extract-headings';
import { docsShell } from '@/styles/docsShell';
import { DocsMobileNav } from './DocsMobileNav';
import { DocsSidebarRail, DocsToc } from './DocsSidebar';
import { mdxComponents } from './mdx-components';
import { PropsTable } from './PropsTable';

type DocPageProps = {
  children?: ReactNode;
  headings?: DocHeading[];
  mdx?: string;
  propsDoc?: ComponentPropsDoc | null;
};

export function DocsPageLayout({ children, headings = [], mdx, propsDoc }: DocPageProps) {
  const shell = docsShell();
  const prose = proseContent();
  const components = useMemo(
    () => ({
      ...mdxComponents,
      PropsTable: (props: { slug: string }) => <PropsTable {...props} doc={propsDoc} />,
    }),
    [propsDoc],
  );

  return (
    <>
      <div className={recipeClassName(shell.body)}>
        <DocsSidebarRail />
        <main className={recipeClassName(shell.main)}>
          <div className={recipeClassName(shell.mainInner)}>
            {mdx ? (
              <article className={recipeClassName(prose.root)}>
                <MDXContent code={mdx} components={components} />
              </article>
            ) : (
              <article className={recipeClassName(prose.root)}>{children}</article>
            )}
          </div>
        </main>
        <DocsToc headings={headings} />
      </div>
      <DocsMobileNav />
    </>
  );
}
