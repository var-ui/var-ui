import { categoryLabels, componentRegistry, type ComponentEntry } from '../data/components';
import { githubUrl } from '../data/navigation';
import { hasAstroBinding } from './astro-component-docs';
import { getHtmlApiDoc } from './html-api-docs';

export type ComponentSourceLink = {
  label: string;
  href: string;
};

const reactSourcePaths = Object.keys(
  import.meta.glob('../../../packages/react/src/components/**/*.tsx'),
);

const coreSourcePaths = Object.keys(
  import.meta.glob('../../../packages/core/src/components/**/*.ts'),
);

function slugToComponentName(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function repoPath(relativePath: string): string {
  return `${githubUrl}/blob/main/${relativePath}`;
}

function findReactSourcePath(componentName: string): string | null {
  const suffixes = [
    `/packages/react/src/components/${componentName}.tsx`,
    `/packages/react/src/components/chat/${componentName}.tsx`,
  ];
  const key = reactSourcePaths.find((path) => suffixes.some((suffix) => path.endsWith(suffix)));
  if (!key) return null;
  return key.replace(/^(\.\.\/)+/, '');
}

function findCoreSourcePath(slug: string, recipeName: string | null): string | null {
  const camel = slug.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
  const candidates = [
    `/packages/core/src/components/${recipeName ?? camel}.ts`,
    `/packages/core/src/components/${camel}.ts`,
    `/packages/core/src/components/chat/${camel}.ts`,
    `/packages/core/src/components/typography.ts`,
  ];

  if (slug === 'text') {
    candidates.unshift('/packages/core/src/components/typography.ts');
  }

  const key = coreSourcePaths.find((path) => candidates.some((suffix) => path.endsWith(suffix)));
  if (!key) return null;
  return key.replace(/^(\.\.\/)+/, '');
}

/** Registry entry for a component docs slug, if present. */
export function getComponentEntry(slug: string): ComponentEntry | undefined {
  return componentRegistry.find((entry) => entry.slug === slug);
}

/** Human-readable category label for a component slug. */
export function getComponentCategoryLabel(slug: string): string | undefined {
  const entry = getComponentEntry(slug);
  return entry ? categoryLabels[entry.category] : undefined;
}

/** GitHub source links for the active implementation layers. */
export function getComponentSourceLinks(slug: string): ComponentSourceLink[] {
  const componentName = slugToComponentName(slug);
  const htmlDoc = getHtmlApiDoc(slug);
  const links: ComponentSourceLink[] = [];

  const reactPath = findReactSourcePath(componentName);
  if (reactPath) {
    links.push({ label: 'React', href: repoPath(reactPath) });
  }

  if (hasAstroBinding(slug)) {
    links.push({
      label: 'Astro',
      href: repoPath(`packages/astro/src/components/${componentName}.astro`),
    });
  }

  const corePath = findCoreSourcePath(slug, htmlDoc?.recipeName ?? null);
  if (corePath) {
    links.push({ label: 'Core', href: repoPath(corePath) });
  }

  return links;
}

export type ComponentDocTab = 'documentation' | 'props' | 'styles';

const TAB_IDS: ComponentDocTab[] = ['documentation', 'props', 'styles'];

/** Parse `?tab=` or `#tab` into a supported component docs tab id. */
export function parseComponentDocTab(value: string | null | undefined): ComponentDocTab {
  const normalized = value?.trim().toLowerCase();
  if (normalized && TAB_IDS.includes(normalized as ComponentDocTab)) {
    return normalized as ComponentDocTab;
  }
  return 'documentation';
}
