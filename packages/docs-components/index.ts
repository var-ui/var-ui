export { default } from './src/integration';
export { default as componentDocsPlugin } from './src/integration';

export type { ComponentDocsConfig, ComponentDocsUserConfig } from './src/config';
export { parseComponentDocsConfig, ComponentDocsUserConfigSchema } from './src/config';

export type { DocsFramework } from './src/framework';
export {
  DOCS_FRAMEWORKS,
  FRAMEWORK_COOKIE,
  parseFrameworkCookie,
  readFrameworkFromCookieHeader,
} from './src/framework';
