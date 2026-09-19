/**
 * Reserved `@var-ui/core` package.json export entries.
 * Recipe short names from dist/components must not shadow these keys.
 *
 * @returns {Record<string, string | { types: string; import: string }>}
 */
export function coreReservedExports() {
  return {
    '.': { types: './dist/index.d.mts', import: './dist/index.mjs' },
    './theme-constants': {
      types: './dist/theme-constants.d.mts',
      import: './dist/theme-constants.mjs',
    },
    './register-default-theme': {
      types: './dist/register-default-theme.d.mts',
      import: './dist/register-default-theme.mjs',
    },
    './styles': {
      types: './dist/styles.d.mts',
      import: './dist/styles.mjs',
    },
    './styles.css': './dist/styles.css',
    './base-styles': {
      types: './dist/base-styles.d.mts',
      import: './dist/base-styles.mjs',
    },
    './internal': {
      types: './dist/internal.d.mts',
      import: './dist/internal.mjs',
    },
    './tokens': {
      types: './dist/tokens/index.d.mts',
      import: './dist/tokens/index.mjs',
    },
    './color': {
      types: './dist/color/index.d.mts',
      import: './dist/color/index.mjs',
    },
    './icons': {
      types: './dist/icons/index.d.mts',
      import: './dist/icons/index.mjs',
    },
    './breakpoints': {
      types: './dist/breakpoints.d.mts',
      import: './dist/breakpoints.mjs',
    },
  };
}
