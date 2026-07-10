import type { DocHeading } from '@/lib/extract-headings';

export type DocPayload = {
  slug: string;
  title: string;
  description: string;
  mdx: string;
  headings: DocHeading[];
};

type DocModule = { default: DocPayload };

const componentModules = import.meta.glob<DocModule>(
  '../../.content-collections/slugs/components/*.json',
);
const docsModules = import.meta.glob<DocModule>('../../.content-collections/slugs/docs/*.json');
const themingModules = import.meta.glob<DocModule>(
  '../../.content-collections/slugs/theming/*.json',
);

async function loadDoc(modules: Record<string, () => Promise<DocModule>>, slug: string) {
  const key = Object.keys(modules).find((modulePath) => modulePath.endsWith(`/${slug}.json`));
  if (!key) return null;

  const module = await modules[key]();
  return module.default;
}

export function loadComponentDoc(slug: string) {
  return loadDoc(componentModules, slug);
}

export function loadDocsDoc(slug: string) {
  return loadDoc(docsModules, slug);
}

export function loadThemingDoc(slug: string) {
  return loadDoc(themingModules, slug);
}
