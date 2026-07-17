# V7 Typed Theming & TypeStyles 0.10 Adoption

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt `typestyles@^0.10.0` (new semantic naming, attribute-ready engine, `styles.override` / `__tsMeta`) and ship var-ui’s typed theme customization DX (`extend` / `components` / `overrideComponent` / `customTheme`).

**Architecture:** Core runtime switches to `mode: 'attribute'` with an `overrides` cascade layer. Theme sugar (`createDesignTheme`) compiles `components` to `styles.override(..., { selectorPrefix, layer: 'overrides' })`. React wrappers spread recipe `.props` / per-slot attrs so variant state is `data-*` in the DOM.

**Tech Stack:** typestyles 0.10, `@var-ui/core`, `@var-ui/react`, Vite+ (`vp`), Vitest.

## Global Constraints

- Catalog `typestyles: ^0.10.0` (and matching `@typestyles/vite` / eslint-plugin / cli as needed).
- Runtime layers: `['tokens', 'components', 'overrides', 'utilities']`; recipes stay on `components`; consumer overrides use `overrides`.
- Naming mode: `attribute` (spec decision — debuggable HTML + layers for precedence).
- No class names in consumer theme `components` configs; use `styles.override` / `overrideComponent`.
- Follow existing core patterns (`create-theme.ts`, `runtime.ts`, recipe exports).
- Prefer TDD for new APIs; regenerate `.typestyles-public-classnames.json` after recipe/runtime changes.
- Do not commit unless the user asks.

## File map

| File                                              | Responsibility                                |
| ------------------------------------------------- | --------------------------------------------- |
| `pnpm-workspace.yaml`                             | Catalog version bumps                         |
| `packages/core/src/runtime.ts`                    | `mode: 'attribute'`, `overrides` layer        |
| `packages/core/src/create-theme.ts`               | `extend` + `components` compilation           |
| `packages/core/src/extend-tokens.ts` (new)        | `extendTokens` primitive                      |
| `packages/core/src/override-component.ts` (new)   | `overrideComponent` wrapper                   |
| `packages/core/src/themeable-components.ts` (new) | Registry of public recipes                    |
| `packages/core/src/types.ts`                      | `DesignThemeConfig` / `DesignTheme` generics  |
| `packages/core/src/index.ts`                      | Public exports                                |
| `packages/react/.../DesignSystemProvider`         | `customTheme` prop                            |
| `packages/react/src/components/*`                 | Spread attribute `.props` / slot attrs        |
| `examples/vite-app`                               | Demo theme exercising `extend` + `components` |
| `specs/typed-component-theming.md` / `ROADMAP.md` | Status updates                                |

---

### Task 0: Bump TypeStyles 0.10 + runtime (attribute + overrides layer)

**Files:**

- Modify: `pnpm-workspace.yaml`
- Modify: `packages/core/src/runtime.ts`
- Modify: companion `@typestyles/*` versions if required
- Modify: React wrappers + any class-string assertions / classname snapshot
- Test: `vp test run` / `vp check` after install

- [ ] **Step 1: Bump catalog**

In `pnpm-workspace.yaml`:

```yaml
typestyles: ^0.10.0
'@typestyles/vite': ^0.4.4
```

Bump root / core `@typestyles/eslint-plugin` and `@typestyles/cli` to latest compatible with 0.10 if install warns.

- [ ] **Step 2: Install**

Run: `vp install` (or `pnpm install` if `vp install` is the project norm per AGENTS.md).

- [ ] **Step 3: Update runtime**

```ts
export const { styles, tokens, global } = createTypeStyles({
  scopeId: 'var-ui',
  mode: 'attribute',
  layers: ['tokens', 'components', 'overrides', 'utilities'] as const,
  tokenLayer: 'tokens',
  globalLayer: 'tokens',
});
```

- [ ] **Step 4: Fix React wrappers for attribute returns**

Dimensioned recipes: `const r = button({ intent, size });` then `{...r.props}` (merge `className` with `cx`).  
Slot recipes: per-slot `ComponentAttrsResult` — spread `.props` on each element; keep shared variant attrs.  
`cx(recipeResult, className)` still works via string coercion to className only — attrs must be spread separately.

- [ ] **Step 5: Regenerate public classname snapshot + fix tests**

Attribute mode public classes are base/slot classes only (no per-option classes). Update `.typestyles-public-classnames.json` via CLI or manual regen. Fix `getRegisteredCss()` assertions that expect old `*-base` / `*-intent-*` selectors — expect `var-ui-button[data-intent=…]` style rules instead.

- [ ] **Step 6: Verify**

Run: `vp check && vp test run`  
Expected: PASS (or only failures belonging to later tasks).

---

### Task 1: `extendTokens` + `createDesignTheme` `extend`

**Files:**

- Create: `packages/core/src/extend-tokens.ts`
- Modify: `packages/core/src/create-theme.ts`, `types.ts`, `index.ts`
- Create/modify: `packages/core/src/create-theme.test.ts` / new extend tests

- [ ] **Step 1: Write failing tests** for mode-aware leaves, plain string leaves, returned refs on `.tokens`, and theme-scoped CSS under `.theme-<name>`.

- [ ] **Step 2: Implement `extendTokens` + `extend` on `createDesignTheme`** per `specs/typed-component-theming.md` (register namespace once via `tokens.create`; apply values via theme / `:root`).

- [ ] **Step 3: Export + make tests pass.**

---

### Task 2: `themeableComponents` + `overrideComponent` + `components`

**Files:**

- Create: `packages/core/src/themeable-components.ts`, `override-component.ts`
- Modify: `create-theme.ts`, `types.ts`, `index.ts`
- Tests: spy/`getRegisteredCss` for `styles.override` emission; registry completeness test

- [ ] **Step 1: Registry** mapping public recipe names → recipe fns; unit test `registry ⊇` public recipe exports.

- [ ] **Step 2: `overrideComponent(recipe, config, { theme? })`** → `styles.override(..., { selectorPrefix: theme?.className && `.${theme.className}`, layer: 'overrides' })`.

- [ ] **Step 3: `createDesignTheme({ components: (t) => ({…}) })`** — callback receives `DesignTokens & TokenRefsOf<E>`; compile each entry through `overrideComponent`.

- [ ] **Step 4: Tests green.**

---

### Task 3: `customTheme` on `DesignSystemProvider`

**Files:** React provider + test

- [ ] Accept `customTheme?: DesignTheme` alongside `customThemeClassName`; apply `theme.className`.

---

### Task 4: Docs + example demo theme

- [ ] Restructure customization docs (config DX primary).
- [ ] Example-app theme using `extend` + `components` (light/dark visual QA).

---

### Task 5: Roadmap / spec status

- [ ] Check off V7; mark TypeStyles override row **Shipped** in `ROADMAP.md`.
- [ ] Align `typed-component-theming.md` engine status with 0.10.

---

## Execution order

Do Task 0 completely before Task 1 (attribute + class rename breakages otherwise hide API bugs). Tasks 1→2→3 are sequential; 4–5 can trail once APIs work.
