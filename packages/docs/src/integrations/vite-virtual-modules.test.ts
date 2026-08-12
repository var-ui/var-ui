import { describe, expect, it } from 'vite-plus/test';
import { parseVarDocsConfig } from '../config';
import { vitePluginVarDocsVirtualModules } from './vite-virtual-modules';

describe('vitePluginVarDocsVirtualModules', () => {
  it('exposes a named plugin for virtual:var-docs/config', () => {
    const config = parseVarDocsConfig({
      title: 'Var UI',
      theme: { defaultClassName: 'theme-var-ui-default' },
      typestyles: { entry: 'typestyles-entry.ts' },
      components: { Layout: './src/layouts/BaseLayout.astro' },
    });
    const plugin = vitePluginVarDocsVirtualModules(config, {
      root: new URL('file:///tmp/project/'),
    });
    expect(plugin.name).toBe('vite-plugin-var-docs-virtual-modules');
    expect(plugin.resolveId).toBeTruthy();
    expect(plugin.load).toBeTruthy();

    const payload = `export default ${JSON.stringify(config)};`;
    expect(payload).toContain('"title":"Var UI"');
    expect(payload).toContain('"defaultClassName":"theme-var-ui-default"');
  });
});
