import type { ComponentPropsDoc } from '@/lib/extract-component-props';

const propsModules = import.meta.glob<{ default: ComponentPropsDoc }>('../generated/props/*.json');

export async function loadComponentProps(slug: string): Promise<ComponentPropsDoc | null> {
  const key = Object.keys(propsModules).find((modulePath) => modulePath.endsWith(`/${slug}.json`));

  if (!key || key.endsWith('/index.json')) {
    return null;
  }

  const module = await propsModules[key]();
  return module.default;
}
