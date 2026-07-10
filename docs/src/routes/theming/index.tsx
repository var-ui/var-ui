import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsPageLayout } from '@/components/DocsPageLayout';
import { loadThemingDoc } from '@/lib/load-doc';

export const Route = createFileRoute('/theming/')({
  loader: async () => {
    const doc = await loadThemingDoc('index');
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Theming'} | Var UI` },
      { name: 'description', content: loaderData?.description ?? '' },
    ],
  }),
  component: ThemingIndexPage,
});

function ThemingIndexPage() {
  const doc = Route.useLoaderData();

  return <DocsPageLayout headings={doc.headings} mdx={doc.mdx} />;
}
