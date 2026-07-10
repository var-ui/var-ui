import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsPageLayout } from '@/components/DocsPageLayout';
import { loadComponentDoc } from '@/lib/load-doc';

export const Route = createFileRoute('/components/')({
  loader: async () => {
    const doc = await loadComponentDoc('index');
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Components'} | Var UI` },
      { name: 'description', content: loaderData?.description ?? '' },
    ],
  }),
  component: ComponentsIndexPage,
});

function ComponentsIndexPage() {
  const doc = Route.useLoaderData();

  return <DocsPageLayout headings={doc.headings} mdx={doc.mdx} />;
}
