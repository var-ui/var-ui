# @var-ui/core

Framework-agnostic design tokens and recipes used by the [docs site](../../docs/README.md), [`@var-ui/react`](../react/README.md), and example apps.

This is a **library package** (not a standalone app). Import it from apps or the docs site; styles register as side effects when modules load.

## Quick start

```ts
import { button, layout, text, designTokens, defaultTheme } from '@var-ui/core';

// Recipes return callable + destructurable class helpers
document.body.className = defaultTheme.className;
element.className = button({ intent: 'primary' });
```

For syntax highlighting in docs or apps:

```ts
import '@var-ui/core/codeHighlight';
```

Pair with a **typestyles extraction entry** in consuming apps so token and recipe CSS lands in production output — see [`examples/vite-app`](../vite-app/README.md).

## Recipe inventory

Every recipe follows the [`c.vars()` override contract](#authoring-recipes) and
emits stable public class names.

| Category       | Recipes                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| **Actions**    | `button`, `linkButton`, `link`                                                                                |
| **Data input** | `textField`, `textAreaField`, `checkbox`, `radio`, `switchStyles`, `select`, `field` (+ `fieldChrome` helper) |
| **Feedback**   | `alert`, `banner`, `badge`, `spinner`, `skeleton`, `progressBar`, `statusDot`                                 |
| **Layout**     | `stack`, `grid`, `section`, `center`, `aspectRatio`, `divider`, `layout`/`text` utilities                     |
| **Content**    | `heading`, `textBlock`, `kbd`, `emptyState`, `codeBlock`, `proseContent`, `steps`, `fileTree`                 |
| **Containers** | `card`, `carousel`, `thumbnail`, `avatar`, `avatarGroup`                                                      |
| **Overlay**    | `dialog`, `overlay`, `commandPalette`, `tabs`                                                                 |
| **Icons**      | `icon` recipe + `IconName` union / `iconNameList` (glyphs live in `@var-ui/icons`)                            |

## Token layers

Tokens are grouped for clarity; recipes consume the flat `designTokens` object (unchanged ergonomics).

| Export                  | Role                                                     | CSS namespaces                                                          |
| ----------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| `designPrimitiveTokens` | Spacing, radii, typography scale, shadows, motion curves | `space`, `radius`, `font`, `shadow`, `duration`, `easing`, `transition` |
| `designSemanticTokens`  | Product colors, syntax palette, docs semantics           | `color`, `codeSyntax`, `doc`                                            |
| `designComponentTokens` | Per-component surfaces (code blocks today)               | `codeBlock`                                                             |

**`doc`** maps prose, nav, table, callout, and code-shell roles to `var(--color-*)`. Override `--doc-*` in a theme to retune docs chrome without touching every recipe.

**`codeBlock`** defaults through `doc` so code blocks track prose; override `--codeBlock-*` alone for a distinct code-block palette.

**`designMotion`** is a convenience handle: `designMotion.duration.fast`, `designMotion.transition.panelEnter`, etc. New presets include `transition.colorShift` (links) and `transition.controlSurface` (buttons).

## Theme surfaces

Palettes are built with `createDesignTheme()` (see `src/create-theme.ts`): one **`ThemeSurface`**
per palette with **`base` light tokens**, ambient light/dark/system modes on **`data-mode`**
(`scope: 'self'`), and optional **fixed-tone descendant surfaces** on **`data-surface`**.

| Export         | `className`     | Role                      |
| -------------- | --------------- | ------------------------- |
| `defaultTheme` | `theme-default` | Default slate / blue ramp |
| `forestTheme`  | `theme-forest`  | Forest / sage palette     |
| `roseTheme`    | `theme-rose`    | Rose palette              |
| `amberTheme`   | `theme-amber`   | Amber palette             |

Each export is a **`DesignTheme`** (`ThemeSurface` from `tokens.createTheme`: `className`,
`name`, string coercion). Strip other palette classes before switching palette (see
`docs/src/tokens.ts` for the list used by the docs site).

### Ambient light / dark mode

Dark overrides follow OS preference unless `data-mode="light"` or `data-mode="dark"` is set on
the **same element** that carries the theme class.

### Fixed-tone surfaces (`SURFACE_ATTRIBUTE`)

Import `SURFACE_ATTRIBUTE` (`'data-surface'`) from `@var-ui/core`. Mark a subtree with
`data-surface="dark"` or `data-surface="light"` to pin that face regardless of ambient mode —
useful for always-dark toasts, code blocks, or cards on an otherwise light page:

```html
<div class="theme-default" data-mode="light">
  <article data-surface="dark" class="card-root">…</article>
</div>
```

All built-in themes register both `surfaces.light` and `surfaces.dark`, reusing each theme's
existing light/dark token sets. Keep fixed-tone wrappers scoped tightly — nested subtrees cannot
"reset" to ambient mode without an explicit opposite surface marker.

### Astro (no React context)

Use a tiny inline script to set **one** palette class on `document.documentElement` and **`data-mode`** for light/dark/system:

```astro
---
import { defaultTheme } from '@var-ui/core';
---
<script is:inline define:vars={{ themeClass: defaultTheme.className }}>
  const key = 'theme-mode';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = localStorage.getItem(key);
  const mode =
    stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored
      : prefersDark
        ? 'dark'
        : 'light';
  document.documentElement.classList.add(themeClass);
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-mode');
  } else {
    document.documentElement.setAttribute('data-mode', mode);
  }
</script>
```

`import.meta.env.SSR` stays irrelevant: the snippet runs in the browser only. Swap `defaultTheme` for another palette export when you change brand themes.

## Theming helpers

```ts
import { mergeDesignThemeOverrides, createBrandAccentOverrides, tokens } from '@var-ui/core';

const brand = createBrandAccentOverrides({
  accent: '#7c3aed',
  accentHover: '#6d28d9',
  accentForeground: '#ffffff',
});

const subtleCodeBlock = mergeDesignThemeOverrides(brand, {
  codeBlock: { rootBg: '#0c1222', headerBg: '#111827' },
});

export const themeAcme = tokens.createTheme('ds-acme', { base: subtleCodeBlock });
```

Use `tokens.createTheme('ds-<name>', { base: { … } })` with the same namespace keys as your token map (`color`, `syntax`, `codeBlock`, primitives, etc.). Add `colorMode` or `modes` when you need conditional layers; palette themes in this package use `createDesignTheme` for the full light/dark/system pattern.

## Authoring recipes

Component recipes expose themeable **surface colors** (background, border, foreground) as
component-scoped CSS custom properties via `c.vars()` in the recipe callback:

- Register colors with `{ value, syntax: '<color>', inherits: false }` (see `button.ts`).
- Use `v.background.var` (etc.) in base styles; assign variants with `[v.background.name]: tokenValue`.
- Layout, spacing, and type scale stay as direct token references unless a theme need appears.

This is the primary override surface (Tier 1) — values inherit through nested `.theme-*`
boundaries without `@scope` or extra cascade tricks.

## Customizing components

### Tier 1 — component-scoped CSS variables (preferred)

Override a recipe's registered vars in theme CSS or `createDesignTheme` overrides. Example
for buttons on a custom theme:

```css
.theme-acme .button-base {
  --button-background: var(--color-accent-default);
  --button-foreground: var(--color-text-on-accent);
}
```

### Tier 2 — plain CSS against semantic class names

When a property was not exposed as a var, target the public class name directly. For a
single theme region, a later cascade layer wins:

```css
@layer utilities {
  .theme-acme .card-root {
    box-shadow: var(--shadow-lg);
  }
}
```

### Tier 2 — nested conflicting themes (`styles.scope()`)

When two theme regions nest and both override the same component, use TypeStyles'
`styles.scope()` so proximity — not source order — decides the winner (`@scope` requires
Chrome 118+, Firefox 128+, Safari 17.4+):

```ts
import { styles } from '@var-ui/core';

styles.scope({ root: '.theme-windows-95', layer: 'utilities' }, 'button-base', {
  borderColor: 'var(--color-border-strong)',
  backgroundColor: 'var(--color-background-subtle)',
});
```

See [TypeStyles theming docs](https://typestyles.dev/docs/theming) for engine details.

## Public class name contract

Semantic class names emitted by `styles.component()` / `styles.class()` in this package are
**public API**. Consumers may target them with plain CSS or `styles.scope()`. Renaming a
namespace or variant key is a **semver-major** change for `@var-ui/core`.

Guard accidental renames with a committed snapshot:

```bash
cd packages/core
pnpm exec typestyles snapshot --write
```

Adding class names is free; removing or renaming requires a major bump and a deliberate
`snapshot --write`. CI enforces this via `@typestyles/no-removed-public-classname`.

## Extending tokens safely

1. **New primitive or semantic keys** — Add to the corresponding `*Values` file under `src/tokens/` (e.g. `primitive-values.ts`, `color-values.ts`), then extend `DesignThemeOverrides` in `theme-api.ts` if themes should override them.
2. **Docs-only tweaks** — Prefer `doc` or `codeBlock` overrides so `color` stays the single source for core brand neutrals.
3. **Breaking renames** — Avoid renaming existing CSS custom properties; add aliases if you must migrate consumers gradually.

## CodeBlock copy helper pattern

Use the `codeBlock` recipe with `data-*` hooks so any framework (or vanilla JS) can attach clipboard behavior:

```html
<div class="...codeBlock('root')" data-codeblock>
  <div class="...codeBlock('header')" data-codeblock-header>
    <div class="...codeBlock('actions')">
      <button
        type="button"
        class="...codeBlock('copyButton') ...codeBlock('copyButtonIdle')"
        data-codeblock-copy
        data-copy-label="Copy code"
        data-copied-label="Copied"
        aria-label="Copy code"
      >
        Copy
      </button>
      <span
        class="...codeBlock('feedback') ...codeBlock('feedbackInline')"
        data-codeblock-feedback
        role="status"
        aria-live="polite"
      ></span>
    </div>
  </div>
  <pre><code>...</code></pre>
</div>
```

Minimal behavior:

1. On `[data-codeblock-copy]` click, read text from the closest code element and write to `navigator.clipboard`.
2. Toggle `data-copied` or `data-error` on the button for visual state styles.
3. Set button `aria-label` to `Copied` on success, and restore to `Copy code` after a timeout.
4. Announce status text through `[data-codeblock-feedback]` (`role="status"` + `aria-live="polite"`).

## Syntax highlighting (`highlight.js`)

Import the stylesheet side effect once (it registers `ds-hljs` rules):

```ts
import '@var-ui/core/codeHighlight';
```

### Semantic tokens (`codeSyntax`)

| Token                     | Meaning                                              |
| ------------------------- | ---------------------------------------------------- |
| `base`                    | Default foreground                                   |
| `keyword`                 | Keywords, types, `language_*`                        |
| `title`                   | Titles, class names, function names                  |
| `attr`                    | Attributes, numbers, operators, variables, selectors |
| `string`                  | Strings, regexps                                     |
| `builtIn`                 | Built-ins, symbols                                   |
| `comment`                 | Comments, doc formulas                               |
| `name`                    | XML tags, pseudo-selectors                           |
| `section`                 | Headings                                             |
| `bullet`                  | List bullets                                         |
| `addition` / `additionBg` | Diff additions (foreground / wash)                   |
| `deletion` / `deletionBg` | Diff deletions (foreground / wash)                   |

Values default to the docs site oklch ramps (`codeSyntaxLightValues`). Dark mode: override `--codeSyntax-*` in your theme class (the docs app merges `codeSyntaxDarkValues` into `theme-docs-dark`).

### highlight.js class mapping

highlight.js emits `span` nodes with classes like `hljs-keyword`. This theme groups them as follows:

- **keyword** — `.hljs-keyword`, `.hljs-type`, `.hljs-template-*`, `.hljs-variable.language_*`, …
- **title** — `.hljs-title` (+ class / function variants)
- **attr** — `.hljs-attr`, `.hljs-number`, `.hljs-operator`, `.hljs-variable`, selector classes, …
- **string** — `.hljs-string`, `.hljs-regexp`, `.hljs-meta .hljs-string`
- **comment** — `.hljs-comment`, `.hljs-code`, `.hljs-formula`
- **addition / deletion** — `.hljs-addition`, `.hljs-deletion`

Use `hljs.highlight(code, { language })` (or `marked-highlight` with `langPrefix: 'hljs language-'`) so the output includes these classes; typography inherits from `.hljs` on the root `code` element.

## Learn more

- [`@var-ui/react`](../react/README.md) — React wrappers for these recipes
- [Design system guide](https://typestyles.dev/docs/design-system) — patterns for building your own
- [Documentation site](../../docs/README.md) — primary consumer of this package

## Prose / docs content primitives (`proseContent`)

Long-form markdown helpers live in `proseContent` from `@var-ui/core`. Put `proseContent('root')` on the element that wraps rendered HTML.

Covered primitives:

| Primitive         | Markdown / HTML                    | Notes                                                                      |
| ----------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| **Blockquote**    | `> …`                              | Tinted panel + accent border                                               |
| **`kbd`**         | `<kbd>Ctrl</kbd>`                  | Keyboard cap styling                                                       |
| **Badge**         | `<span data-docs-badge>New</span>` | Optional `data-docs-badge-tone`: `success`, `warning`, `danger`, `info`    |
| **Table**         | GFM tables                         | For wide tables wrap with `<div class="…proseContent('tableWrap')">`       |
| **Divider**       | `---` → `<hr>`                     | Themed horizontal rule                                                     |
| **Heading links** | `h1`–`h6`                          | Apps can inject `<a data-prose-heading-anchor>` permalinks (see docs site) |

**Docs site** composes `proseContent('root')` with site overrides and merges `designColorDarkValues` into the dark theme so `--color-*` tracks the shell.

### Admonition-style callouts (markdown-only)

GFM does not have native admonitions. Options:

1. **`Alert` recipe** — Prefer Astro/React components (`alert` + `Alert.astro` / `Alert.tsx`) for `info` | `success` | `warning` | `danger` | `tip` with solid/subtle modes.
2. **Blockquote convention** — Use a leading label line:

   ```md
   > **Note**  
   > Short supporting copy in plain markdown.
   ```

   Style tweaks for `blockquote > p:first-child strong` can be added in your app if you want label colors per keyword.

3. **Raw HTML** — `<div data-alert …>` is not defined; use the `alert()` classes from the design system or the component wrappers above.
