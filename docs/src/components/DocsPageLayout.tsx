'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
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
      <div className={shell.body}>
        <DocsSidebarRail />
        <main className={shell.main}>
          <div className={shell.mainInner}>
            {mdx ? (
              <article className={prose.root}>
                <MDXContent code={mdx} components={components} />
              </article>
            ) : (
              <article className={prose.root}>{children}</article>
            )}
          </div>
        </main>
        <DocsToc headings={headings} />
      </div>
      <DocsMobileNav />
    </>
  );
}
