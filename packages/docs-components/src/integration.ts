import type { AstroIntegration } from 'astro';
import { AstroError } from 'astro/errors';
import { fileURLToPath } from 'node:url';
import {
  parseComponentDocsConfig,
  type ComponentDocsConfig,
  type ComponentDocsUserConfig,
} from './config';
import { extractPropsPlugin } from './integrations/extract-props';

/**
 * Optional Astro integration for design-system component catalogs.
 * Guide-only docs sites should omit this and use `@var-ui/docs` alone.
 */
export default function componentDocsPlugin(
  userOpts: ComponentDocsUserConfig = {},
): AstroIntegration {
  if (typeof userOpts !== 'object' || userOpts === null || Array.isArray(userOpts)) {
    throw new AstroError(
      'Invalid config passed to componentDocsPlugin',
      'Expected a configuration object (or omit for defaults).',
    );
  }

  let config: ComponentDocsConfig;
  try {
    config = parseComponentDocsConfig(userOpts);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new AstroError('Invalid config passed to componentDocsPlugin', message);
  }

  return {
    name: '@var-ui/docs-components',
    hooks: {
      'astro:config:setup': ({ config: astroConfig, updateConfig, addMiddleware, logger }) => {
        if (!config.disableMiddleware) {
          addMiddleware({
            entrypoint: '@var-ui/docs-components/middleware',
            order: 'pre',
          });
          logger.info('Registered framework middleware');
        }

        if (!config.disableComponentRoutes) {
          logger.warn(
            'Component route injection is not enabled yet; keep site-owned `/components` pages (Netlify SSR).',
          );
        }

        if (config.extractProps) {
          const root = fileURLToPath(astroConfig.root);
          updateConfig({
            vite: {
              plugins: [
                extractPropsPlugin({
                  root,
                  write: config.extractProps.write,
                  outputDir: config.extractProps.outputDir,
                  watch: config.extractProps.watch,
                }),
              ],
              ssr: {
                noExternal: ['@var-ui/docs-components'],
              },
            },
          } as Parameters<typeof updateConfig>[0]);
          logger.info(`extractProps → ${config.extractProps.outputDir}`);
        }
      },
    },
  };
}
