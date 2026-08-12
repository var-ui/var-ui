import { defineMiddleware } from 'astro:middleware';
import { FRAMEWORK_COOKIE, parseFrameworkCookie } from './framework';

/** Sets `Astro.locals.framework` from the framework cookie. */
export const onRequest = defineMiddleware(async (context, next) => {
  const raw = context.cookies.get(FRAMEWORK_COOKIE)?.value;
  context.locals.framework = parseFrameworkCookie(raw);
  return next();
});
