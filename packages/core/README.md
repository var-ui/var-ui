# @var-ui/core

Framework-agnostic design tokens and recipes used by the [docs site](../../docs/README.md), [`@var-ui/react`](../react/README.md), and example apps.

This is a **library package** (not a standalone app). Import it from apps or the docs site; styles register as side effects when modules load.

## Quick start

```ts
import { button, layout, text, designTokens, defaultThemeClassName } from '@var-ui/core';

// The default theme surface is registered when the package loads (name: `default`).
document.body.className = defaultThemeClassName; // `theme-var-ui-default`
element.className = button({ intent: 'primary' });
```

Custom themes return a `DesignTheme` from `createDesignTheme({ name: 'acme' })` — use
`theme.className` the same way. See [Theme surfaces](#theme-surfaces).

For syntax highlighting in docs or apps:

```ts
import '@var-ui/core/codeHighlight';
```

Pair with a **typestyles extraction entry** in consuming apps so token and recipe CSS lands in production output — see [`examples/vite-app`](../vite-app/README.md).

### Key exports

| Area              | Exports                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| **Themes**        | `createDesignTheme`, `DEFAULT_THEME_NAME`, `defaultThemeClassName`, `SURFACE_ATTRIBUTE`, `mergeThemeOverrides` |
| **Tokens**        | `designTokens`, `tokens`, `tokenValues`, `generateColors`, `lightSyntaxValues`, `darkSyntaxValues`             |
| **Customization** | `extendTokens`, `when`, `themeWhen`, `themeableComponents`, `defineFonts`, `groteskMono`                       |
| **TypeStyles**    | `typestyles`, `styles`, `global`                                                                               |
| **Types**         | `DesignTheme`, `DesignThemeConfig`, `DesignThemePreset`, `ThemeComponentsConfig`, `OverrideConfigFor`, …       |

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

Tokens are declared once via `tokens.declare(tokenSchema)` and exposed as `designTokens`
(aliases: `tokens`). Default values live in `tokenValues`; the built-in theme surface
registers them on package load.

| Export         | Role                                                                 |
| -------------- | -------------------------------------------------------------------- |
| `designTokens` | All registered token refs (`palette`, `space`, `color`, `stroke`, …) |
| `tokens`       | Alias for `designTokens` (the `tokens.declare` handle)               |
| `tokenValues`  | Default registered values (`DesignThemePreset.tokens` base)          |

### Token namespaces (expanded)

| Namespace                    | Keys (indicative)                 | Notes                                                                                                   |
| ---------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `palette`                    | 39 families × 10 steps            | Fixed primitive ramp                                                                                    |
| `space`                      | `0`–`20` (non-contiguous)         | Layout spacing                                                                                          |
| `size.control` / `size.icon` | `sm`, `md`, `lg`                  | Control heights + icon box                                                                              |
| `breakpoint`                 | `sm`–`xl`                         | Mode-invariant media-query widths                                                                       |
| `zIndex`                     | `base` … `max`                    | Stacking scale                                                                                          |
| `opacity`                    | `disabled`, `muted`               | Shared opacity semantics                                                                                |
| `letterSpacing`              | `tight`, `normal`, `wide`, `caps` | Typography rhythm                                                                                       |
| `color.*`                    | semantic UI colors                | Full tree via `tokens.declare`; default light face in `tokenValues.color`, dark patches via `colorMode` |
| `color.code`                 | syntax-highlighting palette       | Used by `codeHljsScope`; aliases `lightSyntaxValues` / `darkSyntaxValues` for theme presets             |
| `shadow.elevation`           | `low`, `med`, `high`              | Soft elevation (alongside brutalist `shadow.xs`–`xl`)                                                   |
| `stroke`                     | `default`, `strong`               | Border shorthand (fixed)                                                                                |

Theme overrides example:

```ts
createDesignTheme({
  tokens: {
    size: { control: { md: '36px' } },
    zIndex: { toast: 600 },
    color: {
      background: { popover: designTokens.palette['sand-1'] },
    },
  },
});
```

**Non-goals:** no `tokens.components.*`, chart/data palette, or Astryx-style communication hue tables — recipes compose global `color.*` instead.

Theme values accept **token-ref leaves**: raw CSS (`'#0064E0'`, `'16px'`) or refs into registered tokens (`designTokens.palette['sky-7']`, `designTokens.radius.lg`). Refs stringify to `var(--var-ui-…)` in emitted CSS.

**Note:** syntax-highlighting colors live under `color.code` (`--var-ui-color-code-*`), not a
top-level `syntax` namespace. There is no `codeBlock` token namespace — the `codeBlock` recipe
reads semantic `color.*` plus Tier 1 `c.vars()`.

## Theme surfaces

Themes are thin wrappers around TypeStyles `tokens.createTheme`. Class names use the
configured scope: `theme-var-ui-<name>` (e.g. `theme-var-ui-default`).

### Default theme

Importing `@var-ui/core` registers the built-in default surface (`createDesignTheme({ name: 'default' })`).
Use the class name directly:

| Export                  | Value                    | Role                                         |
| ----------------------- | ------------------------ | -------------------------------------------- |
| `DEFAULT_THEME_NAME`    | `'default'`              | Built-in theme name                          |
| `defaultThemeClassName` | `'theme-var-ui-default'` | Class for the pre-registered default surface |

Additional palette themes (forest, rose, amber, Windows 95, …) are **not** bundled exports —
copy examples from [`docs/src/themes/`](../../docs/src/themes/) in the docs repo.

### Authoring a theme

`createDesignTheme` merges a preset, token patches, ambient color mode, and optional
component overrides:

1. **`from`** — optional `DesignThemePreset` (`{ tokens?, colorMode?, fonts? }`); defaults to built-in `tokenValues` + dark color mode
2. **`tokens`** — mode-invariant overrides (light `color` face lives here by default)
3. **`colorMode`** — ambient `{ light?, dark? }` color patches (compiled to `light-dark()`)
4. **`generateColors`** — optional helper to build `{ light, dark }` color trees from an accent
5. **`modes` / `extend` / `components` / `fonts`** — extra TypeStyles modes, custom tokens, typed recipe overrides, `@font-face` rules

```ts
import {
  createDesignTheme,
  designTokens,
  generateColors,
  tokenValues,
  type DesignThemePreset,
} from '@var-ui/core';

// Reusable preset (spread into createDesignTheme)
export const acmePreset: DesignThemePreset = {
  tokens: {
    color: {
      accent: {
        default: designTokens.palette['sky-7'],
        hover: designTokens.palette['sky-8'],
      },
    },
    radius: { md: designTokens.radius.lg },
  },
};

// Accent-generated color mode
const { light, dark } = generateColors({ accent: '#7c3aed' });

export const acmeTheme = createDesignTheme({
  name: 'acme',
  from: acmePreset, // optional; built-in defaults apply when omitted
  colorMode: { light, dark },
  components: {
    button: (t) => ({
      base: { borderRadius: t.radius.lg.var },
    }),
  },
});

// acmeTheme.className → `theme-var-ui-acme`
```

### What `createDesignTheme` compiles to

```ts
typestyles.tokens.createTheme(name, {
  base: { ...mergedModeInvariantTokens, color: lightColor },
  colorMode: {
    light: { color: mergedLightColorPatch },
    dark: { color: mergedDarkColorPatch },
  },
  modes: [...extraModes],
});

// Optional per-recipe overrides:
styles.override(recipe, overrideConfig, {
  selectorPrefix: `.${theme.className}`,
  layer: 'overrides',
});
```

Each return value is a **`DesignTheme`**: `ThemeSurface` (`className`, `name`, string coercion)
plus `tokens` (built-in refs merged with any `extend` namespaces).

### Ambient light / dark mode

Dark overrides follow OS preference unless `data-mode="light"` or `data-mode="dark"` is set on
the **same element** that carries the theme class. Only the **color** tree (including
`color.code`) flips; radius, fontSize, etc. stay on `base`.

### Fixed-tone surfaces (`SURFACE_ATTRIBUTE`)

Import `SURFACE_ATTRIBUTE` (`'data-surface'`) from `@var-ui/core`. Global `color-scheme`
rules for `data-surface="light"` and `data-surface="dark"` are registered in `runtime.ts`
on package load — no theme option required.

Mark a subtree to pin light or dark chrome regardless of ambient mode:

```html
<div class="theme-var-ui-default" data-mode="light">
  <article data-surface="dark" class="var-ui-card-root">…</article>
</div>
```

Keep wrappers scoped tightly — nested subtrees cannot "reset" to ambient mode without an
explicit opposite surface marker.

> **Note:** `surfaces` on `DesignThemeConfig` is deprecated and has no effect. Use
> `SURFACE_ATTRIBUTE` markers and the global rules above instead.

### Astro (no React context)

Use a tiny inline script to set **one** palette class on `document.documentElement` and **`data-mode`** for light/dark/system:

```astro
---
import { defaultThemeClassName } from '@var-ui/core';
---
<script is:inline define:vars={{ themeClass: defaultThemeClassName }}>
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

`import.meta.env.SSR` stays irrelevant: the snippet runs in the browser only. Swap
`defaultThemeClassName` for another theme's `className` when you change brand themes.

## Theming helpers

Prefer `createDesignTheme` with an optional `from` preset. Use `generateColors` when you want
an accent-generated color tree:

```ts
import { createDesignTheme, generateColors, tokenValues } from '@var-ui/core';

const { light, dark } = generateColors({ accent: '#7c3aed' });

export const acme = createDesignTheme({
  name: 'acme',
  from: { tokens: tokenValues }, // optional; this is the implicit default
  colorMode: { light, dark },
});
```

`generateColors` returns `{ light, dark }` (`DesignColorValues` patches, including `code`).
That shape plugs straight into `colorMode`. For advanced merges, `mergeThemeOverrides` is
available (aliased as `deepMergeThemeOverrides`) — it is not a second theme API. Use `extend` / `components` for custom tokens and
typed recipe restyles via `styles.override`.

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
.theme-var-ui-acme .var-ui-button {
  /* component-scoped vars from c.vars() — exact names match the recipe */
  --var-ui-button-background: var(--var-ui-color-accent-default);
  --var-ui-button-foreground: var(--var-ui-color-text-on-accent);
}
```

### Tier 2 — plain CSS against semantic class names

When a property was not exposed as a var, target the public class name directly. For a
single theme region, a later cascade layer wins:

```css
@layer utilities {
  .theme-var-ui-acme .var-ui-card-root {
    box-shadow: var(--var-ui-shadow-lg);
  }
}
```

### Tier 2 — nested conflicting themes (`styles.scope()`)

When two theme regions nest and both override the same component, use TypeStyles'
`styles.scope()` so proximity — not source order — decides the winner (`@scope` requires
Chrome 118+, Firefox 128+, Safari 17.4+):

```ts
import { styles } from '@var-ui/core';

styles.scope({ root: '.theme-var-ui-windows-95', layer: 'utilities' }, 'button-base', {
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

1. **New primitive or semantic keys** — Add values under `src/tokens/`, extend `DesignTokens` / `DesignThemeTokenValues`, and include them in `tokenSchema` + `tokenValues`.
2. **Theme-level patches** — Prefer `createDesignTheme({ from, tokens, colorMode, modes })`. Code-block chrome uses Tier 1 `c.vars()` / `components`, not a dedicated token namespace.
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

### Semantic tokens (`color.code`)

Syntax highlighting reads `designTokens.color.code` (`--var-ui-color-code-*`).
`lightSyntaxValues` / `darkSyntaxValues` are aliases exported for theme presets.

| Token                             | Meaning                                              |
| --------------------------------- | ---------------------------------------------------- |
| `base`                            | Default foreground                                   |
| `keyword`                         | Keywords, types, `language_*`                        |
| `title`                           | Titles, class names, function names                  |
| `attr`                            | Attributes, numbers, operators, variables, selectors |
| `string`                          | Strings, regexps                                     |
| `builtIn`                         | Built-ins, symbols                                   |
| `comment`                         | Comments, doc formulas                               |
| `name`                            | XML tags, pseudo-selectors                           |
| `section`                         | Headings                                             |
| `bullet`                          | List bullets                                         |
| `addition` / `additionBackground` | Diff additions (foreground / wash)                   |
| `deletion` / `deletionBackground` | Diff deletions (foreground / wash)                   |

Defaults ship in `tokenValues.color.code` (light face) and the built-in dark `colorMode`
patch. Override via theme `colorMode` or a `from` preset's `tokens.color` / `colorMode.dark`.

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

**Docs site** composes `proseContent('root')` with site overrides and passes a custom
`createDesignTheme` surface so semantic `--var-ui-color-*` tracks the shell.

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
