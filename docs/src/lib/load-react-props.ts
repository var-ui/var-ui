import type { ComponentPropsDoc } from './extract-component-props';

const modules = import.meta.glob('../generated/props/*.json', {
  eager: true,
}) as Record<string, { default: ComponentPropsDoc } | ComponentPropsDoc>;

function unwrap(mod: { default: ComponentPropsDoc } | ComponentPropsDoc): ComponentPropsDoc {
  if (mod && typeof mod === 'object' && 'default' in mod && mod.default) {
    return mod.default;
  }
  return mod as ComponentPropsDoc;
}

/** Load extracted React props JSON for a component slug, or null if missing. */
export function loadReactPropsDoc(slug: string): ComponentPropsDoc | null {
  const key = Object.keys(modules).find((path) => path.endsWith(`/${slug}.json`));
  if (!key) return null;
  return unwrap(modules[key]!);
}
