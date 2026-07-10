import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsPageLayout } from '@/components/DocsPageLayout';
import { loadComponentDoc } from '@/lib/load-doc';
import { loadComponentProps } from '@/lib/load-props';

export const Route = createFileRoute('/components/$slug')({
  loader: async ({ params }) => {
    const [doc, propsDoc] = await Promise.all([
      loadComponentDoc(params.slug),
      loadComponentProps(params.slug),
    ]);
    if (!doc) throw notFound();
    return { ...doc, propsDoc };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Component'} | Var UI` },
      { name: 'description', content: loaderData?.description ?? '' },
    ],
  }),
  component: ComponentDocPage,
});

function ComponentDocPage() {
  const doc = Route.useLoaderData();

  return <DocsPageLayout headings={doc.headings} mdx={doc.mdx} propsDoc={doc.propsDoc} />;
}
