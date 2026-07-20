// Build-time CSS extraction entry point for @typestyles/vite.
//
// This module exists purely to give the extraction bundle a complete picture
// of every `styles.component()` / `styles.class()` registration that the docs
// site can render: everything inside `@var-ui/core` and `@var-ui/react`, plus
// docs-owned modules that call `styles.component` directly (`homeBento`).
//
// Deliberately plain side-effect imports (not `import * as x from ...`
// namespace re-exports). Namespace-import-and-re-export was the exact pattern
// that triggered esbuild's tree-shaking to silently drop `styles.component()`
// registrations for `sideEffects: false`-marked packages like `@var-ui/core`
// (see typestyles PR #126 / build-runner's `treeShaking: false` fix). That fix
// makes this safe regardless of import style, but side-effect imports remain
// the clearest way to express "run this module for its registrations."
import '@var-ui/core';
import '@var-ui/react';
import './src/styles/homeBento';
