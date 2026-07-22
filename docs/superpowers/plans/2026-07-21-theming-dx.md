# Theming DX Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the parallel `light`/`dark`/`surfaces` theming sugar with a thin TypeStyles-shaped `createDesignTheme` (`from` + `tokens` + `colorMode` + `modes`), move syntax under `color`, remove `codeBlock` tokens, and type theme leaves so token refs work.

**Architecture:** Var UI owns the token shape and packs; TypeStyles owns `createTheme` / `colorMode` / `modes`. `createDesignTheme` only deep-merges packs and forwards. `createColorTheme` stays `{ light, dark }` color trees (now including `syntax`) and plugs into `colorMode`.

**Tech Stack:** TypeStyles (`typestyles` catalog), Vite+ (`vp check`, `vp test`), Vitest via `vite-plus/test`, pnpm workspace `@var-ui/core`.

**Spec:** `docs/superpowers/specs/2026-07-21-theming-dx-design.md`

## Global Constraints

- Follow the spec’s locked decisions; do not reintroduce `light` / `dark` / `surfaces` on `DesignThemeConfig`.
- Do not fold `accent` into `createDesignTheme`; do not regenerate gallery themes via `createColorTheme`.
- Do not edit `node_modules` or committed `dist/` outputs (local build artifacts are fine to regenerate).
- Core tests: `vite-plus/test` + `getRegisteredCss()` from `typestyles` (do **not** call `reset()` unless an existing test already does for extend registry).
- Validation after each task that touches code: `vp test packages/core` (or the specific test files named in the task), then `vp check` before the task’s commit when types/API change.
- Commits: conventional (`feat(core):`, `docs:`, `test(core):`). Commit when the task says to.
- Naming: runtime refs stay `designTokens`; packs are `defaultTokens`, `forestTokens`, … (`DesignTokenPack`).
- Theme leaf types must accept literals **or** token refs (`DesignTokenLeaf`); do not use `as const` literal-only maps on pack/theme boundaries.

### File map

| Area               | Files                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Leaf / color types | `packages/core/src/tokens/semantic.ts` (add `DesignTokenLeaf`, `WithTokenLeaves`, nest `syntax` on `DesignColorValues`) |
| Token registration | `packages/core/src/tokens/index.ts` — syntax under `color`; remove `codeBlock` / `designComponentTokens`                |
| codeBlock recipe   | `packages/core/src/components/codeBlock.ts` — `t.color.*` defaults                                                      |
| HLJS               | `packages/core/src/components/codeHighlight.ts` — `t.color.syntax`                                                      |
| Theme types        | `packages/core/src/types.ts` — new `DesignThemeConfig` / `DesignTokenPack` / `DesignThemeTokenValues`                   |
| Theme factory      | `packages/core/src/create-theme.ts` (+ `create-theme.test.ts`, `create-theme.extend.test.ts`)                           |
| Color helper       | `packages/core/src/tokens/create-color-theme.ts` (+ test + snapshots)                                                   |
| Default pack       | `packages/core/src/themes/default-values.ts`, `default.ts`                                                              |
| Palette themes     | `forest.ts`, `rose.ts`, `amber.ts`                                                                                      |
| Style themes       | `ai-glow.ts`, `new-wave.ts`, `windows-95.ts`, `classic-system.ts`                                                       |
| Barrel             | `packages/core/src/themes/index.ts`, `packages/core/src/index.ts`                                                       |
| Docs               | `packages/core/README.md`, `specs/color-scale-generation.md` (consumption), design spec status                          |

### PR grouping (optional)

1. **Types + token registration + codeBlock** — Tasks 1–2
2. **createDesignTheme + createColorTheme** — Tasks 3–4
3. **Migrate built-in themes** — Tasks 5–6
4. **Docs** — Task 7

---

### Task 1: Token leaf types + `syntax` under `DesignColorValues`

**Files:**

- Modify: `packages/core/src/tokens/semantic.ts`
- Modify: `packages/core/src/types.ts` — drop standalone `DesignSemanticValues.syntax` if present; re-export updated color types
- Test: add type-level / unit coverage in `packages/core/src/tokens/semantic.test.ts` (create) **or** fold into Task 3’s type test — prefer create `semantic.test.ts` only if needed; otherwise a `expectTypeOf` in create-theme test in Task 3 is enough. For this task, rely on `vp check` after Task 2 wires registration.

**Interfaces:**

- Produces:

```ts
export type DesignTokenLeaf = string | number;

export type WithTokenLeaves<T> = {
  [K in keyof T]: T[K] extends string | number ? DesignTokenLeaf : WithTokenLeaves<T[K]>;
};

export type DesignSyntaxValues = {
  /* unchanged keys */
};

export type DesignColorValues = WithTokenLeaves<{
  background: { app: string; surface: string; subtle: string; elevated: string };
  text: { primary: string; secondary: string; onAccent: string; onDanger: string };
  accent: { default: string; hover: string };
  border: { default: string; strong: string; focus: string };
  shadow: { offset: string };
  danger: { default: string; solid: string };
  success: { default: string; solid: string };
  warning: { default: string; onSolid: string };
  info: { default: string; onSolid: string };
  overlay: { default: string };
  syntax: DesignSyntaxValues;
}>;

// DesignColorRefs: keep derived keys; base must include syntax (can be empty strings in shell)
```

- Consumes: existing `DesignSyntaxValues` key set

- [ ] **Step 1: Update `semantic.ts` types**

Move `syntax` onto `DesignColorValues` via `WithTokenLeaves`. Export `DesignTokenLeaf` and `WithTokenLeaves`. Keep `defaultLightSyntaxValues` / `defaultDarkSyntaxValues` as standalone tables (used by packs and `createColorTheme`).

Update `DesignColorRefs` so it still extends the color tree (syntax inherits from `DesignColorValues`).

- [ ] **Step 2: Fix immediate type fallout in theme color objects**

Every `DesignColorValues` object in `themes/*.ts` and `default-values.ts` will fail typecheck until `syntax` is added — **do not** fully migrate packs yet. Temporarily add `syntax: defaultLightSyntaxValues` / `defaultDarkSyntaxValues` (or a cast) on each color object so `vp check` can proceed after Task 2. Prefer adding `syntax` onto the existing light/dark color consts now (minimal), leaving `createDesignTheme({ light, dark })` still working until Task 3.

Example for forest light colors:

```ts
const forestLightColorValues: DesignColorValues = {
  // …existing fields…
  syntax: defaultLightSyntaxValues,
};
```

Repeat for all theme color maps (light + dark).

- [ ] **Step 3: Run typecheck**

Run: `vp check`

Expected: may still fail on `tokens/index.ts` until Task 2; if only theme files were missing `syntax`, fix those first. Complete Task 2 in the same sitting if registration blocks check.

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/tokens/semantic.ts packages/core/src/themes packages/core/src/types.ts
git commit -m "$(cat <<'EOF'
feat(core): nest syntax under DesignColorValues with token-ref leaves

EOF
)"
```

---

### Task 2: Register `color.syntax`, remove `codeBlock` tokens, update recipes

**Files:**

- Modify: `packages/core/src/tokens/index.ts`
- Modify: `packages/core/src/components/codeBlock.ts`
- Modify: `packages/core/src/components/codeHighlight.ts`
- Modify: any imports of `syntaxTokens` / `codeBlockTokens` / `designComponentTokens`

**Interfaces:**

- Produces: `designTokens.color.syntax.*` refs; no `designTokens.syntax` or `designTokens.codeBlock`
- Consumes: Task 1 `DesignColorValues` (with `syntax`)

- [ ] **Step 1: Rewrite color shell + drop syntax/codeBlock namespaces**

In `packages/core/src/tokens/index.ts`:

1. Extend `emptyThemeColorValues` with `syntax: emptySyntaxValues` (move empty syntax object under color).
2. Put `syntax: emptySyntaxValues` on `colorRefShape` (derived keys stay; syntax leaves remain empty shells filled by themes).
3. Remove `syntaxTokens = tokens.create('syntax', …)`.
4. Remove `codeBlockTokens` and `designComponentTokens`.
5. `designSemanticTokens` becomes `{ color: colorTokens, stroke: strokeTokens }` only.
6. `designTokens` no longer spreads component tokens.

- [ ] **Step 2: Point `codeBlock` recipe at `t.color.*`**

In `codeBlock.ts` `c.vars` defaults:

```ts
background: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
backgroundInline: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
backgroundHeader: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
lineHighlightBackground: { value: `${t.color.background.subtle}`, syntax: '<color>', inherits: false },
// border already uses t.color.border.default — keep
```

Remove every `t.codeBlock.*` reference.

- [ ] **Step 3: Point HLJS at `t.color.syntax`**

In `codeHighlight.ts`:

```ts
const s = t.color.syntax;
```

Update the file comment: themes retune via `--var-ui-color-syntax-*` (not `--syntax-*`).

- [ ] **Step 4: Grep and fix stragglers**

Run: `rg "t\\.syntax|syntaxTokens|codeBlockTokens|designComponentTokens|t\\.codeBlock" packages/core --glob '*.ts'`

Expected: no matches (except maybe comments/README — leave README for Task 7).

- [ ] **Step 5: Test**

Run: `vp test packages/core`

Expected: PASS (or only failures related to old theme CSS custom property names for syntax — fix any snapshot/CSS assertions that look for `--var-ui-syntax-` to `--var-ui-color-syntax-`).

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/tokens/index.ts packages/core/src/components/codeBlock.ts packages/core/src/components/codeHighlight.ts
git commit -m "$(cat <<'EOF'
feat(core): fold syntax into color tokens and remove codeBlock namespace

EOF
)"
```

---

### Task 3: New `DesignThemeConfig` + thin `createDesignTheme`

**Files:**

- Modify: `packages/core/src/types.ts`
- Modify: `packages/core/src/create-theme.ts`
- Modify: `packages/core/src/create-theme.test.ts`
- Modify: `packages/core/src/create-theme.extend.test.ts`
- Modify: `packages/core/src/themes/default-values.ts` — introduce `defaultTokens` pack (needed as default `from`)
- Modify: `packages/core/src/themes/default.ts` — temporary bridge if needed so gallery still builds

**Interfaces:**

- Produces:

```ts
export type DesignThemeTokenValues = {
  color: DesignColorValues;
  space?: WithTokenLeaves<DesignSpaceValues>;
  radius?: WithTokenLeaves<DesignRadiusValues>;
  fontFamily?: WithTokenLeaves<DesignFontFamilyValues>;
  fontSize?: WithTokenLeaves<DesignFontSizeValues>;
  fontWeight?: WithTokenLeaves<DesignFontWeightValues>;
  lineHeight?: WithTokenLeaves<DesignLineHeightValues>;
  shadow?: WithTokenLeaves<DesignShadowValues>;
  duration?: WithTokenLeaves<DesignDurationValues>;
  easing?: WithTokenLeaves<DesignEasingValues>;
  transition?: WithTokenLeaves<DesignTransitionValues>;
  borderWidth?: WithTokenLeaves<DesignBorderWidthValues>;
};

export type DesignTokenPack = {
  tokens: DesignThemeTokenValues;
  darkColor: DesignColorValues;
};

export type DesignThemeConfig<E extends ExtendMap = Record<string, never>> = {
  name: string;
  from?: DesignTokenPack;
  tokens?: DeepPartial<DesignThemeTokenValues>; // use a DeepPartial that keeps DesignTokenLeaf
  colorMode?: {
    light?: DeepPartial<DesignColorValues>;
    dark?: DeepPartial<DesignColorValues>;
  };
  modes?: ThemeModeDefinition[];
  extend?: E;
  components?: ThemeComponentsConfig<DesignThemeTokens<E>>;
};
```

- Merge algorithm (implement exactly):

```ts
const pack = from ?? defaultTokens;
const mergedTokens = deepMergeThemeOverrides(
  pack.tokens as ThemeOverrides,
  (tokens ?? {}) as ThemeOverrides,
) as DesignThemeTokenValues;
const lightColor = deepMergeThemeOverrides(
  { color: mergedTokens.color } as ThemeOverrides,
  colorMode?.light ? ({ color: colorMode.light } as ThemeOverrides) : undefined,
).color as DesignColorValues;
// Prefer a small deepMergeColor(mergedTokens.color, colorMode?.light) helper if clearer.
const darkColor = deepMerge(pack.darkColor, colorMode?.dark ?? {}) as DesignColorValues;

const base = { ...omitColor(mergedTokens), color: lightColor };
const ambient = tokens.colorMode.systemWithLightDarkOverride({
  attribute: 'data-mode',
  values: { light: 'light', dark: 'dark' },
  scope: 'self',
  light: { color: lightColor },
  dark: { color: darkColor },
});
const theme = tokens.createTheme(config.name, {
  base,
  modes: [...ambient, ...(modes ?? [])],
});
```

Keep `extend` / `components` / `overrideComponent` behavior from the current file.

- [ ] **Step 1: Write failing tests for the new API**

Replace `create-theme.test.ts` surface/ambient cases with the new shape. Example:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { createDesignTheme, SURFACE_ATTRIBUTE } from './create-theme';
import { defaultTokens } from './themes/default-values';
import { designTokens } from './tokens';

function themeClass(name: string) {
  return `.theme-var-ui-${name}`; // adjust to match actual emitted class from existing tests
}

describe('createDesignTheme', () => {
  it('emits dark color overrides without mode-invariant namespaces', () => {
    createDesignTheme({
      name: 'color-only-dark',
      from: defaultTokens,
      tokens: { fontSize: { md: '20px' } },
      colorMode: {
        dark: { accent: { default: '#ff0000', hover: '#cc0000' } },
      },
    });
    const css = getRegisteredCss();
    expect(css).toContain('--var-ui-color-accent-default: #ff0000');
    // fontSize should appear on base, not only inside dark mode blocks as a second copy —
    // assert md=20px exists; dark rules should not re-declare --var-ui-fontSize-md if easy to check
    expect(css).toContain('--var-ui-fontSize-md: 20px');
  });

  it('accepts token refs in tokens.color', () => {
    createDesignTheme({
      name: 'ref-accent',
      colorMode: {
        light: {
          accent: {
            default: designTokens.palette['sky-7'],
            hover: designTokens.palette['sky-8'],
          },
        },
      },
    });
    const css = getRegisteredCss();
    expect(css).toMatch(/--var-ui-color-accent-default:\s*var\(--var-ui-palette-sky-7\)/);
  });

  it('appends consumer modes for surfaces', () => {
    const { tokens: tok, darkColor } = defaultTokens;
    createDesignTheme({
      name: 'with-surface',
      from: defaultTokens,
      modes: [
        {
          id: 'surface-dark',
          overrides: { color: darkColor },
          when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
        },
      ],
    });
    const css = getRegisteredCss();
    expect(css).toContain(`${SURFACE_ATTRIBUTE}="dark"`);
  });
});
```

Fix `themeClass` / CSS assertions to match whatever `create-theme.test.ts` already uses today (copy helpers from the existing file).

Update `create-theme.extend.test.ts` similarly: replace `light`/`dark` with `from: defaultTokens` or omit `from`, keep `extend` / `components` cases.

- [ ] **Step 2: Run tests — expect FAIL**

Run: `vp test packages/core/src/create-theme.test.ts packages/core/src/create-theme.extend.test.ts`

Expected: FAIL (old API or missing `defaultTokens` pack).

- [ ] **Step 3: Implement `defaultTokens` pack in `default-values.ts`**

```ts
export const defaultTokens: DesignTokenPack = {
  tokens: {
    color: {
      ...defaultLightColorValuesWithoutSyntaxOrWith,
      syntax: defaultLightSyntaxValues,
    },
    shadow: neoBrutalistShadow,
  },
  darkColor: {
    ...defaultDarkColorValues,
    syntax: defaultDarkSyntaxValues,
  },
};
```

Refactor so light/dark color consts already include `syntax` (from Task 1). Remove or stop exporting the old `{ color, syntax, shadow }` `defaultLightValues` / `defaultDarkValues` once nothing needs them — keep temporary re-exports only if Task 5/6 not done yet:

```ts
/** @deprecated internal bridge — remove after theme migration */
export const defaultLightValues = { ... }; // delete by end of Task 5
```

Prefer deleting old exports in this task and updating `default.ts` immediately to the new API (smallest bridge).

- [ ] **Step 4: Implement `createDesignTheme` + `types.ts`**

Remove `light` / `dark` / `surfaces` from `DesignThemeConfig`. Wire merge + compilation as in Interfaces. Import `defaultTokens` as the default `from`.

- [ ] **Step 5: Point `defaultTheme` at the new API**

```ts
export const defaultTheme = createDesignTheme({
  name: 'default',
  from: defaultTokens,
  modes: [
    {
      id: 'surface-dark',
      overrides: { color: defaultTokens.darkColor },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    },
    {
      id: 'surface-light',
      overrides: { color: defaultTokens.tokens.color },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'light', { scope: 'descendant' }),
    },
  ],
});
```

Export `defaultTokens` from `themes/default.ts` / `themes/index.ts`. Remove `defaultLightValues` / `defaultDarkValues` public exports (update any remaining imports).

- [ ] **Step 6: Run tests + check**

Run: `vp test packages/core/src/create-theme.test.ts packages/core/src/create-theme.extend.test.ts`  
Run: `vp check`

Expected: PASS for create-theme tests. Other theme files may still use old `light`/`dark` — fix compile errors by migrating those files in Tasks 5–6 **before** claiming Task 3 done, **or** keep a short-lived overload (do **not** — migrate themes next; if `vp check` fails on forest.ts etc., continue directly into Task 5 in the same PR slice).

Practical rule: **finish Task 5 (palette themes) before committing Task 3** if typecheck requires it. Style themes can be Task 6.

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/types.ts packages/core/src/create-theme.ts packages/core/src/create-theme.test.ts packages/core/src/create-theme.extend.test.ts packages/core/src/themes/default-values.ts packages/core/src/themes/default.ts packages/core/src/themes/index.ts
git commit -m "$(cat <<'EOF'
feat(core): thin createDesignTheme with from/tokens/colorMode/modes

EOF
)"
```

---

### Task 4: `createColorTheme` includes `syntax`

**Files:**

- Modify: `packages/core/src/tokens/create-color-theme.ts`
- Modify: `packages/core/src/tokens/create-color-theme.test.ts`
- Modify: snapshots under `packages/core/src/tokens/__snapshots__/` (if present)

**Interfaces:**

- Produces: `{ light: DesignColorValues; dark: DesignColorValues }` with `syntax` set to `defaultLightSyntaxValues` / `defaultDarkSyntaxValues`
- Consumes: Task 1 color shape

- [ ] **Step 1: Extend shape assertion in tests**

```ts
expect(values.syntax).toMatchObject({
  base: expect.any(String),
  keyword: expect.any(String),
  // …key set from DesignSyntaxValues
});
```

Update snapshots if the suite uses them.

- [ ] **Step 2: Run test — expect FAIL**

Run: `vp test packages/core/src/tokens/create-color-theme.test.ts`

Expected: FAIL missing `syntax`.

- [ ] **Step 3: Attach default syntax in `createColorTheme`**

```ts
import { defaultDarkSyntaxValues, defaultLightSyntaxValues } from './semantic';

// in return:
return {
  light: { ...light, syntax: defaultLightSyntaxValues },
  dark: { ...dark, syntax: defaultDarkSyntaxValues },
};
```

- [ ] **Step 4: Run tests**

Run: `vp test packages/core/src/tokens/create-color-theme.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/tokens/create-color-theme.ts packages/core/src/tokens/create-color-theme.test.ts packages/core/src/tokens/__snapshots__
git commit -m "$(cat <<'EOF'
feat(core): include default syntax in createColorTheme output

EOF
)"
```

---

### Task 5: Migrate palette themes (`forest`, `rose`, `amber`) + export packs

**Files:**

- Modify: `packages/core/src/themes/forest.ts`
- Modify: `packages/core/src/themes/rose.ts`
- Modify: `packages/core/src/themes/amber.ts`
- Modify: `packages/core/src/themes/index.ts` — export `forestTokens`, `roseTokens`, `amberTokens`, `defaultTokens`

**Interfaces:**

- Produces: `export const forestTokens: DesignTokenPack` + `forestTheme = createDesignTheme({ name, from: forestTokens, modes })`
- Pattern for each file (forest shown):

```ts
export const forestTokens: DesignTokenPack = {
  tokens: {
    color: forestLightColorValues, // includes syntax
    shadow: neoBrutalistShadow,
  },
  darkColor: forestDarkColorValues, // includes syntax
};

export const forestTheme = createDesignTheme({
  name: 'forest',
  from: forestTokens,
  modes: [
    {
      id: 'surface-dark',
      overrides: { color: forestTokens.darkColor },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    },
    {
      id: 'surface-light',
      overrides: { color: forestTokens.tokens.color },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'light', { scope: 'descendant' }),
    },
  ],
});
```

Import `SURFACE_ATTRIBUTE` from `../create-theme` and `tokens` from `../runtime`.

- [ ] **Step 1: Migrate `forest.ts`, then `rose.ts`, then `amber.ts`**

Delete old `light` / `dark` / `surfaces` configs. Ensure color consts include `syntax`.

- [ ] **Step 2: Export packs from `themes/index.ts`**

```ts
export { defaultTheme, defaultTokens } from './default';
export { forestTheme, forestTokens } from './forest';
export { roseTheme, roseTokens } from './rose';
export { amberTheme, amberTokens } from './amber';
```

- [ ] **Step 3: Test**

Run: `vp test packages/core`  
Run: `vp check`

Expected: PASS for palette themes; style themes may still be broken until Task 6.

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/themes/forest.ts packages/core/src/themes/rose.ts packages/core/src/themes/amber.ts packages/core/src/themes/index.ts packages/core/src/themes/default.ts
git commit -m "$(cat <<'EOF'
feat(core): migrate palette themes to DesignTokenPack + modes surfaces

EOF
)"
```

---

### Task 6: Migrate style themes (`ai-glow`, `new-wave`, `windows-95`, `classic-system`)

**Files:**

- Modify: `packages/core/src/themes/ai-glow.ts`
- Modify: `packages/core/src/themes/new-wave.ts`
- Modify: `packages/core/src/themes/windows-95.ts`
- Modify: `packages/core/src/themes/classic-system.ts`
- Modify: `packages/core/src/themes/index.ts` — export `*Tokens` packs

**Interfaces:**

- Mode-invariant primitives once under `pack.tokens`.
- Dark-only elevation shadows (ai-glow): extra `modes` entry, not a second full tree.

ai-glow sketch:

```ts
export const aiGlowTokens: DesignTokenPack = {
  tokens: {
    ...aiGlowPrimitiveValues, // fontSize, radius, shadow (light elevations), …
    color: { ...aiGlowLightColorValues, syntax: aiGlowLightSyntaxValues },
  },
  darkColor: { ...aiGlowDarkColorValues, syntax: aiGlowDarkSyntaxValues },
};

export const aiGlowTheme = createDesignTheme({
  name: 'ai-glow',
  from: aiGlowTokens,
  modes: [
    {
      id: 'dark-elevation-shadow',
      overrides: { shadow: aiGlowDarkPrimitiveValues.shadow },
      when: tokens.when.or(
        tokens.when.attr('data-mode', 'dark', { scope: 'self' }),
        tokens.when.and(
          tokens.when.not(tokens.when.attr('data-mode', 'light', { scope: 'self' })),
          tokens.when.prefersDark,
        ),
      ),
    },
    // surface-light / surface-dark as in forest
  ],
});
```

**Important:** Match ambient dark detection to what `systemWithLightDarkOverride` emits. If a full `when.or` twin is fragile, prefer the simpler approach used elsewhere in the repo for dark-only patches — inspect TypeStyles docs / existing CSS for `theme-ai-glow` and mirror the same selectors. Acceptable fallback (spec-allowed): put light elevations on `tokens.shadow` and dark elevations only in a mode that uses the same condition objects returned conceptually by colorMode (read generated CSS from a spike test). If wiring a perfect dual condition is too costly, document in the PR that ai-glow dark shadows use:

```ts
{
  id: 'dark-elevation-shadow',
  overrides: { shadow: aiGlowDarkShadow },
  when: tokens.when.attr('data-mode', 'dark', { scope: 'self' }),
}
```

plus a second mode for `prefersDark` when `data-mode` is unset — only if tests show system dark misses the shadow. YAGNI: start with `data-mode=dark` + `prefersDark` OR if tests don’t cover elevation, keep dark shadow values on a mode tied to `tokens.when.prefersDark` and `data-mode=dark` via `when.or`.

For new-wave / windows-95 / classic-system: same pack pattern; primitives once; surfaces as modes; no duplicated fontSize in dark.

- [ ] **Step 1: Migrate all four style themes + export packs**

- [ ] **Step 2: Full core validation**

Run: `vp test packages/core`  
Run: `vp check`

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add packages/core/src/themes/ai-glow.ts packages/core/src/themes/new-wave.ts packages/core/src/themes/windows-95.ts packages/core/src/themes/classic-system.ts packages/core/src/themes/index.ts
git commit -m "$(cat <<'EOF'
feat(core): migrate style themes to token packs and colorMode surfaces

EOF
)"
```

---

### Task 7: Docs + spec status

**Files:**

- Modify: `packages/core/README.md` — rewrite Theme surfaces / Theming helpers / Extending tokens
- Modify: `specs/color-scale-generation.md` — consumption via `colorMode: createColorTheme(…)`
- Modify: `docs/superpowers/specs/2026-07-21-theming-dx-design.md` — Status: Approved / Implemented
- Modify: `specs/surface-tone-override.md` — note `surfaces` config replaced by `modes` (short migration note at top)
- Modify: `specs/typed-component-theming.md` — update any `light`/`dark` examples on `createDesignTheme` if present

**Interfaces:** None (docs only)

- [ ] **Step 1: Rewrite README theming ladder**

Include:

```ts
import {
  createColorTheme,
  createDesignTheme,
  forestTokens,
  tokens,
  SURFACE_ATTRIBUTE,
} from '@var-ui/core';

const colors = createColorTheme({ accent: '#7c3aed' });

export const acme = createDesignTheme({
  name: 'acme',
  from: forestTokens,
  colorMode: colors,
  modes: [
    {
      id: 'surface-dark',
      overrides: { color: colors.dark },
      when: tokens.when.attr(SURFACE_ATTRIBUTE, 'dark', { scope: 'descendant' }),
    },
  ],
});
```

Show compiled TypeStyles form (`tokens.createTheme` + `colorMode.systemWithLightDarkOverride`). Document token-ref leaves. Remove dead helpers (`mergeDesignThemeOverrides`, `createBrandAccentOverrides`, `theme-api.ts`, `designComponentTokens`, `codeBlock` token namespace, stale `designMotion` if absent).

- [ ] **Step 2: Patch related specs**

- [ ] **Step 3: Commit**

```bash
git add packages/core/README.md specs/color-scale-generation.md specs/surface-tone-override.md specs/typed-component-theming.md docs/superpowers/specs/2026-07-21-theming-dx-design.md
git commit -m "$(cat <<'EOF'
docs: document thin createDesignTheme and colorMode createColorTheme path

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement                                               | Task |
| -------------------------------------------------------------- | ---- |
| `DesignTokenLeaf` / `WithTokenLeaves`                          | 1    |
| Syntax under `color` registration + recipes                    | 2    |
| Remove `codeBlock` tokens                                      | 2    |
| Thin `createDesignTheme` (`from`/`tokens`/`colorMode`/`modes`) | 3    |
| Token refs accepted + CSS contains `var(--…)`                  | 3    |
| Default pack `defaultTokens`                                   | 3    |
| `createColorTheme` + syntax                                    | 4    |
| `colorMode: createColorTheme(…)` works                         | 3–4  |
| Palette packs + surface `modes`                                | 5    |
| Style themes; ai-glow dark shadow via `modes`                  | 6    |
| README / stale API cleanup                                     | 7    |
| No `light`/`dark`/`surfaces` on public config                  | 3–6  |

## Self-review notes

- No Amplify `overrides[]`; surfaces are TypeStyles `modes`.
- `extend` / `components` / `overrideComponent` retained.
- `deepMergeThemeOverrides` reused for merges (cast carefully; prefer tiny typed helpers if casts proliferate).
- Public rename break: `defaultLightValues` / `defaultDarkValues` → `defaultTokens`; document in README.
- HLJS / syntax CSS custom property prefix changes — call out as breaking in README.
