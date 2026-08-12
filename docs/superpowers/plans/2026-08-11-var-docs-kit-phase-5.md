# Phase 5 — Theme subsystem hardening

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or execute in-session. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Drive docs showcase themes from `varDocs({ theme: { presets } })` — picker, FOUC script, and lazy CSS extract — so adding a preset is config + theme TS file (no hardcoded ID lists in scripts/plugins).

**Architecture:** Theme _modules_ stay in docs-site (`src/themes/*`, `typestyles-themes/*`). Kit owns runtime helpers, picker/script chrome, and extract Vite/build hooks. Serializable preset fields live in `virtual:var-docs/config`.

**Out of scope:** `theme.components` shell-override proof beyond documenting existing `createDesignTheme({ components })` in a showcase file; playground wiring (Phase 6).

---

## File map

| Path                                                  | Role                                                                   |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `packages/docs/src/config.ts`                         | Add `theme.presets[]` Zod                                              |
| `packages/docs/src/utils/theme/*`                     | extract CSS, lazy href, apply/set theme APIs                           |
| `packages/docs/src/integrations/theme-css-extract.ts` | Dev middleware + `buildDocsThemeStyles()`                              |
| `packages/docs/src/components/DocsThemePicker.*`      | Prop-driven or config-driven picker                                    |
| `packages/docs/src/components/DocsThemeScript.astro`  | FOUC script from presets                                               |
| `docs/src/themes/presets.ts`                          | Single source list for site + `varDocs` config                         |
| `docs/astro.config.mjs`                               | Pass `theme.presets`; drop site dev plugin                             |
| `docs/package.json`                                   | prebuild uses kit `buildDocsThemeStyles` (or rely on integration hook) |

---

### Task 1: `theme.presets` schema + helpers

- [ ] Zod:

```ts
presets: z.array(
  z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    className: z.string().min(1),
    swatch: z.string().optional(),
    lazyCss: z.boolean().optional(), // default: true when id !== first/default
    /** Extract module relative to project root */
    entry: z.string().optional(), // default: `typestyles-themes/${id}.ts`
  }),
).optional();
```

- [ ] Utils: `getLazyThemePresets`, `getDocsThemeStylesHref`, `extractThemeOnlyCss`, `createThemeClassMap`
- [ ] Unit tests

### Task 2: Lazy CSS extract in kit

- [ ] `docsThemeStylesDevPlugin({ root, presets })` — replace site plugin
- [ ] `buildDocsThemeStyles({ root, presets, outDir })` — replace `build-theme-styles.mjs`
- [ ] `varDocs()` wires dev plugin when presets with lazyCss exist; `astro:build:start` writes `public/themes/*.css`
- [ ] Add `@typestyles/build-runner` peer/devDep on `@var-ui/docs`
- [ ] Site: remove hardcoded plugin + script list; prebuild can drop script if build hook covers it (keep thin `node` call if hook timing is wrong for Netlify)

### Task 3: Picker + ThemeScript in kit

- [ ] Move `DocsThemePicker` / `DocsThemeScript` / picker styles into package
- [ ] Astro wrappers read `virtual:var-docs/config` and pass presets as props
- [ ] Generic `docs-theme.ts` API parameterized by presets (or reads config on client via serialized props)
- [ ] Site BaseLayout imports from `@var-ui/docs/DocsThemePicker` etc.
- [ ] Site `showcaseThemes.ts` re-exports from `themes/presets.ts`

### Task 4: Wire docs site + verify

- [ ] `themes/presets.ts` lists all current SHOWCASE themes
- [ ] `astro.config` `theme.presets: docsThemePresets`
- [ ] Tests + `vp check`
- [ ] Smoke: load `/`, switch Forest, confirm `/themes/forest.css` loads; default still works
- [ ] Update design spec Phase 5 status

## Success

- Adding a preset = theme TS + `typestyles-themes/{id}.ts` + one entry in `presets.ts` (no edits to build script ID arrays)
- Picker / script / extract all driven by that list via kit
