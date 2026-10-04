import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import docsPackage from '../../package.json' with { type: 'json' };

/** Map `@var-ui/docs` subpath imports to absolute files in this package. */
export function buildVarDocsExportAliases(pkgRoot: string): Map<string, string> {
  const aliases = new Map<string, string>();
  const exportsField = docsPackage.exports as Record<string, string>;

  for (const [subpath, relTarget] of Object.entries(exportsField)) {
    if (typeof relTarget !== 'string') continue;
    const importId = subpath === '.' ? '@var-ui/docs' : `@var-ui/docs${subpath.replace(/^\./, '')}`;
    aliases.set(importId, resolve(pkgRoot, relTarget.replace(/^\.\//, '')));
  }

  return aliases;
}

/**
 * Resolve `@var-ui/docs/*` through Vite so `.astro` kit components compile in consuming sites.
 */
export function vitePluginVarDocsPackageExports(pkgRoot: string): Plugin {
  const aliases = buildVarDocsExportAliases(pkgRoot);

  return {
    name: 'vite-plugin-var-docs-package-exports',
    resolveId: {
      filter: { id: /^@var-ui\/docs(\/|$)/ },
      handler(source) {
        return aliases.get(source);
      },
    },
  };
}
