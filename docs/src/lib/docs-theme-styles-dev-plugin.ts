import type { Plugin } from 'vite';
import { runTypestylesBuild } from '@typestyles/build-runner';
import { extractThemeOnlyCss } from './extract-theme-css';
import { LAZY_DOCS_THEME_IDS, type LazyDocsThemeId } from './showcase-theme-ids';

const THEME_ID_PATTERN = /^\/themes\/([a-z0-9-]+)\.css$/;

/**
 * Serves per-theme TypeStyles CSS in dev (production files come from `scripts/build-theme-styles.mjs`).
 */
export function docsThemeStylesDevPlugin(docsRoot: string): Plugin {
  const cache = new Map<LazyDocsThemeId, string>();
  const inflight = new Map<LazyDocsThemeId, Promise<string>>();

  return {
    name: 'var-ui:docs-theme-styles-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          next();
          return;
        }

        const url = req.url?.split('?')[0] ?? '';
        const match = url.match(THEME_ID_PATTERN);
        if (!match) {
          next();
          return;
        }

        const themeId = match[1];
        if (!LAZY_DOCS_THEME_IDS.includes(themeId as LazyDocsThemeId)) {
          next();
          return;
        }

        const id = themeId as LazyDocsThemeId;

        try {
          let css = cache.get(id);
          if (!css) {
            if (!inflight.has(id)) {
              inflight.set(
                id,
                runTypestylesBuild({
                  root: docsRoot,
                  modules: [`typestyles-themes/${id}.ts`],
                })
                  .then((built) => {
                    const css = extractThemeOnlyCss(built, id);
                    cache.set(id, css);
                    return css;
                  })
                  .finally(() => {
                    inflight.delete(id);
                  }),
              );
            }
            css = await inflight.get(id)!;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          res.end(css);
        } catch (err) {
          next(err);
        }
      });

      const invalidate = () => {
        cache.clear();
        inflight.clear();
      };
      server.watcher.on('change', invalidate);
      server.watcher.on('add', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}
