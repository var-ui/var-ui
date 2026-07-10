import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsPageLayout } from '@/components/DocsPageLayout';
import { loadDocsDoc } from '@/lib/load-doc';

export const Route = createFileRoute('/docs/$slug')({
  loader: async ({ params }) => {
    const doc = await loadDocsDoc(params.slug);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Docs'} | Var UI` },
      { name: 'description', content: loaderData?.description ?? '' },
    ],
  }),
  component: DocsDocPage,
});

function DocsDocPage() {
  const doc = Route.useLoaderData();

  return <DocsPageLayout headings={doc.headings} mdx={doc.mdx} />;
}
