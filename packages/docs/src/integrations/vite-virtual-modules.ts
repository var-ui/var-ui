import type { AstroConfig } from 'astro';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import type { VarDocsConfig } from '../config';

const pluginResolveIdIdFilter = /^virtual:var-docs\//;
// eslint-disable-next-line no-control-regex -- virtual module prefix
const pluginLoadIdFilter = /^\x00virtual:var-docs\//;

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
  return `\0${id}`;
}

function resolveUserPath(id: string, root: URL): string {
  if (id.startsWith('.') || id.startsWith('/')) {
    return JSON.stringify(resolve(fileURLToPath(root), id));
  }
  return JSON.stringify(id);
}

/** Vite plugin that exposes Var Docs config + overridable components via virtual modules. */
export function vitePluginVarDocsVirtualModules(
  opts: VarDocsConfig,
  { root }: Pick<AstroConfig, 'root'>,
): Plugin {
  const layoutPath = opts.components?.Layout ? resolveUserPath(opts.components.Layout, root) : null;
  const mdxComponentsPath = opts.components?.mdxComponents
    ? resolveUserPath(opts.components.mdxComponents, root)
    : null;

  const modules: Record<string, string> = {
    'virtual:var-docs/config': `export default ${JSON.stringify(opts)};`,
    'virtual:var-docs/components/Layout': layoutPath
      ? `export { default } from ${layoutPath};`
      : `throw new Error('[var-docs] components.Layout is required when guide routes are enabled');`,
    'virtual:var-docs/mdx-components': mdxComponentsPath
      ? `export * from ${mdxComponentsPath};`
      : `export default {};`,
  };

  const resolutionMap = Object.fromEntries(
    Object.keys(modules).map((key) => [resolveVirtualModuleId(key), key]),
  );

  return {
    name: 'vite-plugin-var-docs-virtual-modules',
    resolveId: {
      filter: { id: pluginResolveIdIdFilter },
      handler(id: string): string | void {
        if (id in modules) return resolveVirtualModuleId(id);
      },
    },
    load: {
      filter: { id: pluginLoadIdFilter },
      handler(id: string): string | void {
        const resolution = resolutionMap[id];
        if (resolution) return modules[resolution];
      },
    },
  } as unknown as Plugin;
}
