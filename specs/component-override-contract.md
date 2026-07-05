# Adopting the Component Override Contract — Design-System Layer Spec (V3)

Implements `ROADMAP.md` V3. See TypeStyles'
`specs/component-override-contract.md` for the full engine-side reasoning (why
`@scope` is justified only for the nested-theme tie-breaking case, why
component-scoped CSS variables are the primary override surface, the classname
snapshot lint rule design). TypeStyles P5.3 shipped the engine pieces in
**typestyles 0.8.0**: `styles.scope()`, `typestyles snapshot --write`, and
`@typestyles/no-removed-public-classname`.

This document is the narrower, var-ui-specific task: apply that model to
`packages/core`'s recipes, defend the public classname contract, and document
the two-tier override story on var-ui's own site.

**Status: ready to implement** — bump `typestyles` to `^0.8.0` and add
`@typestyles/eslint-plugin` as a devDependency of `@var-ui/core` before starting.

---

## Prerequisite

```yaml
# pnpm-workspace.yaml catalog
typestyles: ^0.8.0
```

```json
// packages/core/package.json devDependencies
"@typestyles/eslint-plugin": "^0.8.0"
```

Wire the plugin into the repo's eslint config (via Vite+ / `vp lint`) with the
snapshot rule enabled only for `packages/core`.

---

## The two-tier model (var-ui framing)

### Tier 1 — `c.vars()` (primary; do this first)

Component authors expose themeable surface properties as registered CSS custom
properties on the component root. Values inherit through nested `.theme-*`
boundaries automatically — no `@scope`, no extra layer tricks.

**Authoring convention for `@var-ui/core` recipes:**

- Use `c.vars({ … })` on any slot whose **background, border, or foreground
  colors** a theme author is likely to override.
- Register with `{ value, syntax: '<color>', inherits: false }` for colors
  (matches `button.ts` / `badge.ts`).
- Name vars after the CSS property they drive (`background`, `border`,
  `foreground`, or `backgroundColor`/`borderColor`/`textColor` when clearer).
- Variants and pseudo-states assign via `[v.background.name]: tokenValue`, not
  direct `backgroundColor: tokenValue`, when the property is var-backed.
- Structural/layout properties (padding, gap, font-size steps, radius tokens)
  stay as direct token references unless a specific theme need appears — don't
  var-wrap everything preemptively.

Reference implementations already in tree: `button.ts`, `badge.ts`, `alert.ts`.

### Tier 2 — plain CSS or `styles.scope()` (escape hatch)

For properties the author didn't expose as vars, consumers target semantic class
names directly.

| Situation                                | Mechanism                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single theme region, no nesting conflict | Plain selector in a later cascade layer: `.theme-acme .button-base { … }` — works today, no new API.                                                                |
| Nested conflicting theme regions         | `styles.scope({ root: '.theme-beta' }, 'button-base', { … })` — proximity-correct via `@scope`. Document browser support (Chrome 118+, Firefox 128+, Safari 17.4+). |

Import `styles` from `packages/core/src/runtime.ts` — `styles.scope()` is on the
same factory instance recipes already use.

**Nested-theme example** (for var-ui docs, not shipped as library code):

```ts
import { styles } from '@var-ui/core/runtime'; // or relative import in a theme file

// Page is `.theme-default`, embedded widget is `.theme-windows-95`.
// Without @scope, both `.theme-default .button-base` and
// `.theme-windows-95 .button-base` tie on specificity; source order wins.
styles.scope({ root: '.theme-windows-95', layer: 'utilities' }, 'button-base', {
  borderColor: 'var(--color-border-strong)',
  backgroundColor: 'var(--color-background-subtle)',
});
```

Tier 2 is for consumers and theme authors, not for recipe internals — recipes
should stay on Tier 1 for anything themeable.

---

## Task 1 — Recipe audit: expose themeable colors as vars

Audit every `styles.component()` / `styles.class()` recipe under
`packages/core/src/components/`. Convert direct color/border/background
declarations on theme-sensitive slots to the `c.vars()` pattern.

### Audit checklist

Status key: **done** = already uses `c.vars()` for its themeable surfaces;
**convert** = needs the callback form + vars; **review** = mostly typography/layout,
convert only if a slot has an obvious themeable surface triad.

| Recipe file         | Namespace         | Status      | Slots / notes                                                                                                                               |
| ------------------- | ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `button.ts`         | `button`          | **done**    | Reference implementation                                                                                                                    |
| `badge.ts`          | `badge`           | **done**    | Flat component + tone variants                                                                                                              |
| `alert.ts`          | `alert`           | **done**    | Slots + `appearance`/`tone` axes                                                                                                            |
| `card.ts`           | `card`            | **convert** | `root`: border/background; `title`/`body`: foreground; `linkRoot`: hover border                                                             |
| `dialog.ts`         | `dialog`          | **convert** | `overlay`: scrim; `modal`: surface/border; `description`: secondary text                                                                    |
| `textField.ts`      | `text-field`      | **convert** | `input`: surface/border/foreground/placeholder; `label`/`error`: text colors                                                                |
| `textAreaField.ts`  | `text-area-field` | **convert** | Same surface triad as text field                                                                                                            |
| `select.ts`         | `select`          | **convert** | `trigger`/`popover`/`item`: surfaces + selected/focused states                                                                              |
| `checkbox.ts`       | `checkbox`        | **convert** | `box`: border/background + selected state                                                                                                   |
| `radio.ts`          | `radio`           | **convert** | Same pattern as checkbox                                                                                                                    |
| `switch.ts`         | `switch`          | **convert** | Track + thumb background colors                                                                                                             |
| `tabs.ts`           | `tabs`            | **convert** | `tab`: text + selected indicator; `panel`: surface/border                                                                                   |
| `commandPalette.ts` | `command-palette` | **convert** | Input surface, list item hover/selected                                                                                                     |
| `fileTree.ts`       | `file-tree`       | **convert** | Row hover/selected surfaces                                                                                                                 |
| `codeBlock.ts`      | `code-block`      | **convert** | Chrome surface (border/background) — syntax colors stay on syntax tokens                                                                    |
| `codeHighlight.ts`  | `code-hljs-scope` | **review**  | HLJS token colors are syntax-token driven; only convert wrapper chrome if any                                                               |
| `proseContent.ts`   | `prose-content`   | **review**  | Long-form typography; convert blockquote/callout/admonition surfaces, leave body/link colors on semantic tokens unless a theme need appears |
| `steps.ts`          | `steps`           | **convert** | Step indicator + connector colors                                                                                                           |
| `styles.ts`         | `layout`, `text`  | **review**  | Utility recipes — convert only if a slot carries a themeable surface                                                                        |
| `link.ts`           | `link`            | **convert** | `styles.class` — accent color + focus ring; small callback or document as intentionally fixed                                               |

**Done when:** every **convert** row is migrated; **review** rows are either
converted or annotated in-file with a one-line comment explaining why direct
token refs are intentional (e.g. prose body text always follows
`--color-text-primary`).

Add a short "Authoring recipes" section to `packages/core/README.md` stating
the Tier 1 convention (mirror the bullet list above).

---

## Task 2 — Public classname-stability contract

Once a recipe ships from `@var-ui/core`, its semantic class names
(`{namespace}-{slot}` / variant segments) are **public API** — consumers may
target them with plain CSS, `styles.scope()`, or their own `@scope` rules.
Renaming a namespace or variant key is a **semver-major** change for
`@var-ui/core`.

### Snapshot + lint

1. From `packages/core`, run `typestyles snapshot --write` to generate
   `.typestyles-public-classnames.json` at the package root (commit it).
2. Enable `@typestyles/no-removed-public-classname` in eslint config, pointing
   at that snapshot.
3. Document the workflow in `packages/core/README.md`: adding a variant/class
   is free; removing or renaming requires a major bump **and** a deliberate
   `typestyles snapshot --write`.

**Done when:** snapshot is committed; lint rule fails on a local test rename;
README states the promise.

---

## Task 3 — Document the two-tier model (var-ui docs)

Add a "Customizing components" page to the var-ui docs site (or an equivalent
section in `packages/core/README.md` until var-ui.com exists) covering:

1. **Tier 1** — override `--button-background` (etc.) on a theme or via
   `[v.background.name]` assignments in `createDesignTheme`.
2. **Tier 2 non-nested** — `.theme-acme .button-base { … }` in the
   `utilities` layer.
3. **Tier 2 nested** — `styles.scope()` example using var-ui theme class names
   (see code sample above).
4. Browser-support callout for `@scope`.
5. Link to TypeStyles' theming docs for engine details; keep examples
   var-ui-specific (`button`, `card`, built-in theme class names).

**Done when:** docs build; each tier has a copy-pasteable example using
`@var-ui/core` exports.

---

## Testing

- **Recipe snapshots:** existing visual/regression coverage via
  `examples/vite-app` — manually verify converted recipes in at least two themes
  (default + one high-contrast built-in) after the audit.
- **Classname snapshot:** the eslint rule itself is the regression test for
  accidental renames; no separate unit test file required in var-ui.
- **Optional:** a single test that imports `button` and asserts known public
  class strings (`button-base`, etc.) if we want CI independent of eslint — not
  required for V3 if the snapshot rule is wired.

---

## Explicitly out of scope

- Any change to `styles.scope()`, the snapshot script, or the eslint rule
  implementation — TypeStyles' repo.
- Bulk override config objects for theme authors — not planned in TypeStyles
  either.
- Converting non-color themeable properties (padding, radius) to vars without a
  concrete theme override need — YAGNI until a built-in theme requires it.
- V4 `surfaces` / `descendant` scope — separate spec (`surface-tone-override.md`);
  TypeStyles P5.4 is already shipped but var-ui wiring is its own roadmap item.

---

## Implementation Tasks

### Task 0 — Bump dependencies

`typestyles: ^0.8.0` in catalog; add `@typestyles/eslint-plugin` to
`packages/core`; `vp install`.

**Done when:** `styles.scope` is typed on the runtime export; eslint plugin
resolves.

### Task 1 — Recipe var audit

Work through the checklist table; migrate **convert** rows; resolve **review**
rows.

**Done when:** checklist fully **done** or explicitly commented; README
authoring section added.

### Task 2 — Classname snapshot + lint

Generate and commit `.typestyles-public-classnames.json`; configure
`@typestyles/no-removed-public-classname`.

**Done when:** intentional rename fails lint; README documents the contract.

### Task 3 — Docs

Ship the two-tier customizing guide (site or README per availability above).

**Done when:** all three tiers have var-ui examples.

### Task 4 — Mark shipped

Check off V3 in `ROADMAP.md` with the PR link; update the TypeStyles dependency
status row to **Shipped**.
