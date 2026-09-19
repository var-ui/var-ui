/**
 * Vite resolve aliases that map `@var-ui/core` and its subpaths to core source.
 * A string alias for `@var-ui/core` prefix-matches and breaks `/button`, `/tokens`, etc.
 *
 * @param {string} coreSrc absolute path to `packages/core/src`
 * @returns {Array<{ find: RegExp; replacement: string }>}
 */
export function coreSrcAliases(coreSrc) {
  const specials = {
    tokens: 'tokens/index.ts',
    color: 'color/index.ts',
    icons: 'icons/index.ts',
    breakpoints: 'breakpoints.ts',
    'theme-constants': 'theme-constants.ts',
    internal: 'internal.ts',
    styles: 'styles.ts',
    'base-styles': 'base-styles.ts',
    'register-default-theme': 'register-default-theme.ts',
  };
  return [
    ...Object.entries(specials).map(([sub, file]) => ({
      find: new RegExp(`^@var-ui\\/core\\/${sub}$`),
      replacement: `${coreSrc}/${file}`,
    })),
    { find: /^@var-ui\/core\/(.+)$/, replacement: `${coreSrc}/components/$1` },
    { find: /^@var-ui\/core$/, replacement: `${coreSrc}/index.ts` },
  ];
}
