import { fileURLToPath } from 'node:url';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import { defaultThemeClassName } from '@var-ui/core';
import { coreSrcAliases } from '../scripts/core-src-aliases.mjs';
import varDocs from '@var-ui/docs';
import componentDocsPlugin from '@var-ui/docs-components';
import { defineConfig } from 'astro/config';
import { writeComponentProps } from './src/lib/extract-component-props.ts';
import { homepagePreloadPlugin } from './src/lib/homepage-preload-plugin.ts';
import { rolldownJsxOptionsCompat } from './src/lib/rolldown-jsx-options.ts';
import { docsThemePresets } from './src/themes/presets.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const docsRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [
    varDocs({
      title: 'Var UI',
      theme: {
        defaultClassName: defaultThemeClassName,
        // Theme-driven syntax: Shiki uses color.code.* from createDesignTheme().
        syntax: 'design-tokens',
        // Showcase picker + lazy CSS — single list in src/themes/presets.ts
        presets: [...docsThemePresets],
      },
      typestyles: {
        entry: 'typestyles-entry.ts',
      },
      // Free-form guide routes — theming is a site section, not a kit privilege.
      routes: {
        docs: { prefix: '/docs', collection: 'docs' },
        theming: { prefix: '/theming', collection: 'theming' },
      },
      components: {
        Layout: './src/layouts/BaseLayout.astro',
        mdxComponents: './src/lib/guide-mdx-components.ts',
      },
      markdownViews: {
        extraPrefixes: ['/components'],
        tagline: 'Var UI component catalog and guides, as markdown for agents.',
      },
      // Site owns guide pages + middleware (Netlify SSR + workspace `.astro` resolution).
      disableGuideRoutes: true,
      disableMiddleware: true,
    }),
    componentDocsPlugin({
      extractProps: {
        write: writeComponentProps,
        outputDir: 'src/generated/props',
        watch: ['../packages/react/src'],
      },
      disableComponentRoutes: true,
      disableMiddleware: true,
    }),
    react(),
  ],
  vite: {
    ssr: {
      // Workspace packages ship raw `.astro` / `.ts` source — must be processed by Vite SSR.
      noExternal: [
        '@var-ui/docs',
        '@var-ui/docs-components',
        '@var-ui/astro',
        '@var-ui/core',
        '@var-ui/react',
        '@var-ui/icons',
      ],
    },
    plugins: [rolldownJsxOptionsCompat(), homepagePreloadPlugin()],
    resolve: {
      alias: [
        ...coreSrcAliases(`${root}/packages/core/src`),
        { find: '@var-ui/react', replacement: `${root}/packages/react/src/index.ts` },
        { find: '@var-ui/icons', replacement: `${root}/packages/icons/src/index.ts` },
        { find: '@var-ui/astro', replacement: `${root}/packages/astro/index.ts` },
        { find: '@var-ui/docs/schema', replacement: `${root}/packages/docs/schema.ts` },
        { find: '@var-ui/docs/utils', replacement: `${root}/packages/docs/src/utils/index.ts` },
        {
          find: '@var-ui/docs/shiki',
          replacement: `${root}/packages/docs/src/utils/shiki-theme.ts`,
        },
        { find: '@var-ui/docs/middleware', replacement: `${root}/packages/docs/src/middleware.ts` },
        {
          find: '@var-ui/docs/DocsPage',
          replacement: `${root}/packages/docs/src/components/DocsPage.astro`,
        },
        {
          find: '@var-ui/docs/DocsSearch',
          replacement: `${root}/packages/docs/src/components/DocsSearch.astro`,
        },
        {
          find: '@var-ui/docs/DocsSidebar',
          replacement: `${root}/packages/docs/src/components/DocsSidebar.astro`,
        },
        {
          find: '@var-ui/docs/DocsToc',
          replacement: `${root}/packages/docs/src/components/DocsToc.astro`,
        },
        {
          find: '@var-ui/docs/DocsThemePicker',
          replacement: `${root}/packages/docs/src/components/DocsThemePicker.astro`,
        },
        {
          find: '@var-ui/docs/DocsThemeScript',
          replacement: `${root}/packages/docs/src/components/DocsThemeScript.astro`,
        },
        {
          find: '@var-ui/docs/theme-css',
          replacement: `${root}/packages/docs/src/integrations/theme-css-extract.ts`,
        },
        { find: '@var-ui/docs', replacement: `${root}/packages/docs/index.ts` },
        {
          find: '@var-ui/docs-components/framework',
          replacement: `${root}/packages/docs-components/src/framework.ts`,
        },
        {
          find: '@var-ui/docs-components/FrameworkSwitcher',
          replacement: `${root}/packages/docs-components/src/components/FrameworkSwitcher.astro`,
        },
        {
          find: '@var-ui/docs-components/ComponentDocTabs',
          replacement: `${root}/packages/docs-components/src/components/ComponentDocTabs.astro`,
        },
        {
          find: '@var-ui/docs-components/HiddenPropsTable',
          replacement: `${root}/packages/docs-components/src/components/HiddenPropsTable.astro`,
        },
        {
          find: '@var-ui/docs-components/scripts/componentPageTabs',
          replacement: `${root}/packages/docs-components/src/scripts/componentPageTabs.ts`,
        },
        {
          find: '@var-ui/docs-components/scripts/frameworkSwitcher',
          replacement: `${root}/packages/docs-components/src/scripts/frameworkSwitcher.ts`,
        },
        {
          find: '@var-ui/docs-components',
          replacement: `${root}/packages/docs-components/index.ts`,
        },
        { find: '@', replacement: `${docsRoot}/src` },
      ],
    },
  },
});
