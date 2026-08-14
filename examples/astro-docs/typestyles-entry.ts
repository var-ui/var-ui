// Build-time CSS extraction entry for @typestyles/vite (via varDocs).
// Import core source — workspace `dist/styles.mjs` is a stub; esbuild extract
// does not receive Vite aliases that map `@var-ui/core/styles` → src.
import '../../packages/core/src/styles.ts';
