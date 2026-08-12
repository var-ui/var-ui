import { defineMiddleware } from 'astro:middleware';

/**
 * Phase 2 stub — Phase 3 attaches `Astro.locals.varDocsRoute` after content routing.
 * Site middleware (e.g. framework cookie) continues to run independently.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  return next();
});
