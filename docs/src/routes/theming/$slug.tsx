import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsPageLayout } from '@/components/DocsPageLayout';
import { loadThemingDoc } from '@/lib/load-doc';

export const Route = createFileRoute('/theming/$slug')({
  loader: async ({ params }) => {
    const doc = await loadThemingDoc(params.slug);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Theming'} | Var UI` },
      { name: 'description', content: loaderData?.description ?? '' },
    ],
  }),
  component: ThemingDocPage,
});

function ThemingDocPage() {
  const doc = Route.useLoaderData();

  return <DocsPageLayout headings={doc.headings} mdx={doc.mdx} />;
}
