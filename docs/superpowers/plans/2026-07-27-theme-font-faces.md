# Theme Font Faces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `@font-face` registration from hardcoded `runtime.ts` into `createDesignTheme({ fonts })` and a `defineFonts` helper so theme authors co-locate self-hosted fonts with `fontFamily` stacks.

**Architecture:** New `register-font-face.ts` dedupes and calls `typestyles.global.fontFace`. `defineFonts` pairs face definitions with generated stack strings. `createDesignTheme` merges `from.fonts` + `config.fonts` before `tokens.createTheme`. Core default theme stays system-font-only; docs themes opt into `groteskMono` and add theme-specific faces.

**Tech Stack:** TypeStyles (`typestyles` — `global.fontFace`, `getRegisteredCss`, `reset`), Vite+ (`vp check`, `vp test`), Vitest via `vite-plus/test`, pnpm workspace `@var-ui/core`.

**Spec:** `docs/superpowers/specs/2026-07-27-theme-font-faces-design.md`

## Global Constraints

- API: top-level `fonts?: FontFaceDefinition[]` on `DesignThemePreset` and `DesignThemeConfig`; helper name is `defineFonts` (not `defineFontPack`).
- `fontFamily` token shape stays plain CSS strings — no nested `{ face, fallback }` on tokens.
- Default theme registers zero `@font-face` rules after `runtime.ts` cleanup.
- Dedup key: `family` + `fontWeight` + `fontStyle` + normalized `src`.
- Self-hosted paths use root-relative `url('/fonts/…')` for Astro/Vite static serving.
- Core tests: `vite-plus/test` + `getRegisteredCss()` from `typestyles`; call `reset()` and `resetRegisteredFontFaces()` in `beforeEach` where font tests run.
- Validation after code tasks: `vp test packages/core` (or named test files), then `vp check` before commit when types/API change.
- Commits: conventional (`feat(core):`, `docs:`, `test(core):`). Commit when the task says to.

### File map

| Area            | Files                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Types           | `packages/core/src/fonts/types.ts`                                                                                                             |
| Registration    | `packages/core/src/fonts/register-font-face.ts`                                                                                                |
| Helper          | `packages/core/src/fonts/define-fonts.ts`                                                                                                      |
| Preset bundle   | `packages/core/src/fonts/grotesk-mono.ts`                                                                                                      |
| Barrel          | `packages/core/src/fonts/index.ts`                                                                                                             |
| Theme factory   | `packages/core/src/create-theme.ts`                                                                                                            |
| Preset type     | `packages/core/src/tokens/types.ts` (`DesignThemePreset`)                                                                                      |
| Config type     | `packages/core/src/types.ts` (`DesignThemeConfig`)                                                                                             |
| Runtime cleanup | `packages/core/src/runtime.ts`                                                                                                                 |
| Core exports    | `packages/core/src/index.ts`                                                                                                                   |
| Tests           | `packages/core/src/fonts/define-fonts.test.ts`, `packages/core/src/fonts/register-font-face.test.ts`, `packages/core/src/create-theme.test.ts` |
| Docs themes     | `docs/src/themes/ai-glow.ts`, `docs/src/themes/new-wave.ts`                                                                                    |
| Docs extract    | `docs/src/themes/extract.ts` (new), `docs/typestyles-entry.ts`                                                                                 |
| Docs fonts      | `docs/public/fonts/*.woff2`                                                                                                                    |
| Docs content    | `docs/content/theming/customize.mdx`                                                                                                           |

---

### Task 1: Font types, `defineFonts`, and deduped registration

**Files:**

- Create: `packages/core/src/fonts/types.ts`
- Create: `packages/core/src/fonts/register-font-face.ts`
- Create: `packages/core/src/fonts/define-fonts.ts`
- Create: `packages/core/src/fonts/index.ts`
- Create: `packages/core/src/fonts/define-fonts.test.ts`
- Create: `packages/core/src/fonts/register-font-face.test.ts`

**Interfaces:**

- Produces:

```ts
// packages/core/src/fonts/types.ts
export type FontFaceDefinition = {
  family: string;
  src: string | string[];
  fontWeight?: string | number;
  fontStyle?: string;
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  unicodeRange?: string;
};

export type FontSlotConfig = {
  face: FontFaceDefinition;
  fallback: string;
};

export type DefineFontsInput = {
  display?: FontSlotConfig;
  sans?: FontSlotConfig;
  mono?: FontSlotConfig;
};

export type DefineFontsResult = {
  fonts: FontFaceDefinition[];
  tokens: {
    fontFamily: {
      display?: string;
      sans?: string;
      mono?: string;
    };
  };
};
```

```ts
// packages/core/src/fonts/register-font-face.ts
export function fontFaceKey(face: FontFaceDefinition): string;
export function registerFontFace(face: FontFaceDefinition): void;
export function resetRegisteredFontFaces(): void; // test-only reset
```

```ts
// packages/core/src/fonts/define-fonts.ts
export function defineFonts(input: DefineFontsInput): DefineFontsResult;
```

- [ ] **Step 1: Write failing tests for `defineFonts`**

```ts
// packages/core/src/fonts/define-fonts.test.ts
import { describe, it, expect } from 'vite-plus/test';
import { defineFonts } from './define-fonts';

describe('defineFonts', () => {
  it('builds font stacks and collects faces', () => {
    const result = defineFonts({
      sans: {
        face: {
          family: 'Space Grotesk',
          src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
          fontWeight: '300 700',
        },
        fallback: 'ui-sans-serif, system-ui, sans-serif',
      },
      mono: {
        face: {
          family: 'JetBrains Mono',
          src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
        },
        fallback: 'ui-monospace, monospace',
      },
    });

    expect(result.fonts).toHaveLength(2);
    expect(result.tokens.fontFamily.sans).toBe(
      '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    );
    expect(result.tokens.fontFamily.mono).toBe('"JetBrains Mono", ui-monospace, monospace');
  });

  it('omits undefined slots', () => {
    const result = defineFonts({
      sans: {
        face: { family: 'Inter', src: "url('/fonts/inter.woff2') format('woff2')" },
        fallback: 'sans-serif',
      },
    });

    expect(result.tokens.fontFamily).toEqual({ sans: '"Inter", sans-serif' });
    expect(result.tokens.fontFamily.mono).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `vp test packages/core/src/fonts/define-fonts.test.ts`
Expected: FAIL — module `./define-fonts` not found

- [ ] **Step 3: Implement `types.ts`, `define-fonts.ts`, and barrel**

```ts
// packages/core/src/fonts/define-fonts.ts
import type { DefineFontsInput, DefineFontsResult, FontFaceDefinition } from './types';

const FONT_SLOTS = ['display', 'sans', 'mono'] as const;

function fontStack(face: FontFaceDefinition, fallback: string): string {
  return `${JSON.stringify(face.family)}, ${fallback}`;
}

export function defineFonts(input: DefineFontsInput): DefineFontsResult {
  const fonts: FontFaceDefinition[] = [];
  const fontFamily: DefineFontsResult['tokens']['fontFamily'] = {};

  for (const slot of FONT_SLOTS) {
    const config = input[slot];
    if (!config) continue;
    fonts.push(config.face);
    fontFamily[slot] = fontStack(config.face, config.fallback);
  }

  return { fonts, tokens: { fontFamily } };
}
```

```ts
// packages/core/src/fonts/index.ts
export * from './types';
export { defineFonts } from './define-fonts';
export { registerFontFace, resetRegisteredFontFaces, fontFaceKey } from './register-font-face';
```

- [ ] **Step 4: Write failing tests for `registerFontFace`**

```ts
// packages/core/src/fonts/register-font-face.test.ts
import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { getRegisteredCss, reset } from 'typestyles';
import { registerColorSchemeGlobals } from '../runtime';
import { registerFontFace, resetRegisteredFontFaces } from './register-font-face';

describe('registerFontFace', () => {
  beforeEach(() => {
    reset();
    resetRegisteredFontFaces();
    registerColorSchemeGlobals();
  });

  it('registers @font-face in extracted CSS', () => {
    registerFontFace({
      family: 'Space Grotesk',
      src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
      fontWeight: '300 700',
      fontDisplay: 'swap',
    });

    const css = getRegisteredCss();
    expect(css).toContain('@font-face');
    expect(css).toContain('font-family: Space Grotesk');
    expect(css).toContain("url('/fonts/space-grotesk-latin.woff2')");
  });

  it('dedupes identical definitions', () => {
    const face = {
      family: 'JetBrains Mono',
      src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
    };

    registerFontFace(face);
    registerFontFace(face);

    const css = getRegisteredCss();
    const matches = css.match(/font-family: JetBrains Mono/g) ?? [];
    expect(matches).toHaveLength(1);
  });
});
```

- [ ] **Step 5: Implement `register-font-face.ts`**

```ts
// packages/core/src/fonts/register-font-face.ts
import { typestyles } from '../runtime';
import type { FontFaceDefinition } from './types';

const registered = new Set<string>();

export function fontFaceKey(face: FontFaceDefinition): string {
  const src = Array.isArray(face.src) ? face.src.join('|') : face.src;
  return [face.family, face.fontWeight ?? '', face.fontStyle ?? '', src].join('\0');
}

export function registerFontFace(face: FontFaceDefinition): void {
  const key = fontFaceKey(face);
  if (registered.has(key)) return;
  registered.add(key);

  typestyles.global.fontFace(face.family, {
    src: face.src,
    fontWeight: face.fontWeight,
    fontStyle: face.fontStyle,
    fontDisplay: face.fontDisplay,
    unicodeRange: face.unicodeRange,
  });
}

/** Clears dedup registry — for tests only. */
export function resetRegisteredFontFaces(): void {
  registered.clear();
}
```

- [ ] **Step 6: Run font tests**

Run: `vp test packages/core/src/fonts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/fonts/
git commit -m "$(cat <<'EOF'
feat(core): add defineFonts and deduped font-face registration

EOF
)"
```

---

### Task 2: Extend theme types and wire `createDesignTheme`

**Files:**

- Modify: `packages/core/src/tokens/types.ts` — add `fonts?` to `DesignThemePreset`
- Modify: `packages/core/src/types.ts` — add `fonts?` to `DesignThemeConfig`; re-export font types
- Modify: `packages/core/src/create-theme.ts` — merge and register fonts
- Modify: `packages/core/src/create-theme.test.ts` — font integration tests
- Modify: `packages/core/src/index.ts` — export `./fonts`

**Interfaces:**

- Consumes: `registerFontFace`, `FontFaceDefinition` from Task 1
- Produces: `createDesignTheme` registers merged fonts before `tokens.createTheme`

- [ ] **Step 1: Extend types**

```ts
// packages/core/src/tokens/types.ts — add import at top
import type { FontFaceDefinition } from '../fonts/types';

// DesignThemePreset
export type DesignThemePreset = {
  tokens?: DesignThemeTokenValues;
  colorMode?: DesignThemeColorMode;
  fonts?: FontFaceDefinition[];
};
```

```ts
// packages/core/src/types.ts — add to imports from tokens/types or fonts
import type { FontFaceDefinition } from './fonts/types';

// DesignThemeConfig — add field:
  /** Self-hosted @font-face definitions registered when the theme is created. */
  fonts?: FontFaceDefinition[];

// Re-export font types at bottom of types.ts or via index
export type {
  FontFaceDefinition,
  FontSlotConfig,
  DefineFontsInput,
  DefineFontsResult,
} from './fonts/types';
export { defineFonts } from './fonts/define-fonts';
```

```ts
// packages/core/src/index.ts — add
export * from './fonts';
```

- [ ] **Step 2: Write failing integration tests**

Add to `packages/core/src/create-theme.test.ts` `beforeEach`:

```ts
import { resetRegisteredFontFaces } from './fonts/register-font-face';

beforeEach(() => {
  reset();
  resetRegisteredFontFaces();
  resetExtendTokenRegistry();
  registerColorSchemeGlobals();
});
```

Add tests:

```ts
it('registers fonts from config', () => {
  createDesignTheme({
    name: 'with-fonts',
    fonts: [
      {
        family: 'Space Grotesk',
        src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
        fontWeight: '300 700',
      },
    ],
  });

  const css = getRegisteredCss();
  expect(css).toContain('@font-face');
  expect(css).toContain('font-family: Space Grotesk');
});

it('merges fonts from preset then config', () => {
  const preset = {
    fonts: [
      {
        family: 'JetBrains Mono',
        src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
      },
    ],
  };

  createDesignTheme({
    name: 'merged-fonts',
    from: preset,
    fonts: [
      {
        family: 'Space Grotesk',
        src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
      },
    ],
  });

  const css = getRegisteredCss();
  expect(css).toContain('font-family: JetBrains Mono');
  expect(css).toContain('font-family: Space Grotesk');
});

it('default theme does not register font faces', () => {
  const css = getRegisteredCss();
  expect(css).not.toContain('@font-face');
});
```

Note: the third test runs after others in the same file — isolate it in its own `describe` with fresh `beforeEach`, or run it first in a dedicated `describe('default theme fonts')` that only calls `createDesignTheme({ name: 'default' })` after reset without prior font tests in the same block. Prefer a nested describe:

```ts
describe('theme fonts', () => {
  beforeEach(() => {
    reset();
    resetRegisteredFontFaces();
    resetExtendTokenRegistry();
    registerColorSchemeGlobals();
  });

  // …with-fonts and merged-fonts tests…
});

describe('default theme', () => {
  beforeEach(() => {
    reset();
    resetRegisteredFontFaces();
    resetExtendTokenRegistry();
    registerColorSchemeGlobals();
    createDesignTheme({ name: 'default' });
  });

  it('does not register font faces', () => {
    expect(getRegisteredCss()).not.toContain('@font-face');
  });
});
```

Remove the module-level `createDesignTheme({ name: DEFAULT_THEME_NAME })` side effect concern: that runs on import before tests. The existing test file already handles default theme via import side effects — verify the regression test accounts for fonts removed from `runtime.ts` in Task 3. Until Task 3, `@font-face` may still appear from runtime; run Task 2 tests after Task 3 or assert only on themes created in-test.

- [ ] **Step 3: Wire `createDesignTheme`**

```ts
// packages/core/src/create-theme.ts — add import
import { registerFontFace } from './fonts/register-font-face';

// In createDesignTheme, after `const preset = from ?? builtInPreset;`:
const mergedFonts = [...(preset.fonts ?? []), ...(config.fonts ?? [])];
for (const face of mergedFonts) {
  registerFontFace(face);
}

// Destructure config.fonts is not needed separately if using config.fonts above
```

Update destructuring:

```ts
const { from, tokens: tokenOverrides, colorMode, modes, extend, components, fonts } = config;
```

And use:

```ts
const mergedFonts = [...(preset.fonts ?? []), ...(fonts ?? [])];
```

- [ ] **Step 4: Run tests and typecheck**

Run: `vp test packages/core/src/create-theme.test.ts packages/core/src/fonts`
Run: `vp check`
Expected: PASS (font-face tests may still pass if runtime faces exist — Task 3 completes regression)

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/tokens/types.ts packages/core/src/types.ts packages/core/src/create-theme.ts packages/core/src/create-theme.test.ts packages/core/src/index.ts
git commit -m "$(cat <<'EOF'
feat(core): register theme fonts in createDesignTheme

EOF
)"
```

---

### Task 3: Remove runtime hardcoded faces and add `groteskMono`

**Files:**

- Modify: `packages/core/src/runtime.ts` — remove both `typestyles.global.fontFace` blocks
- Create: `packages/core/src/fonts/grotesk-mono.ts`
- Modify: `packages/core/src/fonts/index.ts` — export `groteskMono`

**Interfaces:**

- Produces: `groteskMono: DefineFontsResult` with Space Grotesk + JetBrains Mono using unicode ranges from former `runtime.ts`

- [ ] **Step 1: Create `grotesk-mono.ts`**

```ts
// packages/core/src/fonts/grotesk-mono.ts
import { defineFonts } from './define-fonts';

const LATIN_UNICODE_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

export const groteskMono = defineFonts({
  sans: {
    face: {
      family: 'Space Grotesk',
      src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
      fontWeight: '300 700',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      unicodeRange: LATIN_UNICODE_RANGE,
    },
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  mono: {
    face: {
      family: 'JetBrains Mono',
      src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
      fontWeight: '100 800',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      unicodeRange: LATIN_UNICODE_RANGE,
    },
    fallback: 'ui-monospace, monospace',
  },
});
```

- [ ] **Step 2: Remove font faces from `runtime.ts`**

Delete lines 39–62 (both `typestyles.global.fontFace` calls and their doc comments).

- [ ] **Step 3: Export from barrel**

```ts
// packages/core/src/fonts/index.ts
export { groteskMono } from './grotesk-mono';
```

- [ ] **Step 4: Run default-theme regression test**

Run: `vp test packages/core/src/create-theme.test.ts`
Expected: `default theme` test shows no `@font-face`; font registration tests still pass

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/runtime.ts packages/core/src/fonts/grotesk-mono.ts packages/core/src/fonts/index.ts
git commit -m "$(cat <<'EOF'
feat(core): move default font faces to groteskMono preset helper

EOF
)"
```

---

### Task 4: Migrate docs themes and extraction entry

**Files:**

- Modify: `docs/src/themes/ai-glow.ts`
- Modify: `docs/src/themes/new-wave.ts`
- Create: `docs/src/themes/extract.ts`
- Modify: `docs/typestyles-entry.ts`
- Add: `docs/public/fonts/space-grotesk-latin.woff2` (and optionally `fraunces-latin.woff2`)

**Interfaces:**

- Consumes: `groteskMono`, `defineFonts` from `@var-ui/core`

- [ ] **Step 1: Add font files to `docs/public/fonts/`**

Obtain woff2 files (variable Latin subsets):

- `space-grotesk-latin.woff2` — [Google Fonts](https://fonts.google.com/specimen/Space+Grotesk) or `@fontsource/space-grotesk` package
- `fraunces-latin.woff2` — for ai-glow display (optional v1: skip Fraunces face and keep Georgia fallback only; spec prefers self-hosting — add if file is available)

Minimum for grotesk/mono themes: ensure `space-grotesk-latin.woff2` exists alongside existing `jetbrains-mono-latin.woff2`.

- [ ] **Step 2: Update `ai-glow.ts`**

```ts
import { groteskMono } from '@var-ui/core';

const frauncesFace = {
  family: 'Fraunces',
  src: "url('/fonts/fraunces-latin.woff2') format('woff2')",
  fontWeight: '400 900',
  fontDisplay: 'swap',
} as const;

// In aiGlowPrimitiveValues, replace fontFamily block:
  fontFamily: {
    ...groteskMono.tokens.fontFamily,
    display: '"Fraunces", Georgia, serif',
  },

// In createDesignTheme call, add fonts:
export const aiGlowTheme = createDesignTheme({
  name: 'ai-glow',
  fonts: [...groteskMono.fonts, frauncesFace],
  ...aiGlowPreset,
  // modes unchanged
});
```

Move `fonts` onto preset if preferred:

```ts
export const aiGlowPreset: DesignThemePreset = {
  fonts: [...groteskMono.fonts, frauncesFace],
  tokens: { ... },
  colorMode: { ... },
};
```

- [ ] **Step 3: Update `new-wave.ts`**

```ts
import { groteskMono } from '@var-ui/core';

// Replace fontFamily in newWavePrimitiveValues:
  fontFamily: {
    display: `"Arial Black", Impact, ${groteskMono.tokens.fontFamily.sans?.split(', ').slice(0, 1).join(', ') ?? '"Space Grotesk"'}, system-ui, sans-serif`,
    sans: `"Trebuchet MS", ${groteskMono.tokens.fontFamily.sans ?? '"Space Grotesk", system-ui, sans-serif'}`,
    mono: groteskMono.tokens.fontFamily.mono ?? '"JetBrains Mono", ui-monospace, monospace',
  },
```

Cleaner approach — keep display/sans stacks hand-authored but register faces:

```ts
export const newWavePreset: DesignThemePreset = {
  fonts: groteskMono.fonts,
  tokens: {
    ...newWavePrimitiveValues, // fontFamily strings unchanged
    color: newWaveLightColorValues,
  },
  colorMode: { dark: newWaveDarkColorValues },
};
```

- [ ] **Step 4: Add extraction barrel**

```ts
// docs/src/themes/extract.ts
// Side-effect imports so @font-face rules extract at docs build time.
import './ai-glow';
import './new-wave';
import './windows-95';
import './classic-system';
import './forest';
import './rose';
import './amber';
```

- [ ] **Step 5: Wire `typestyles-entry.ts`**

```ts
import './src/themes/extract';
```

- [ ] **Step 6: Verify docs CSS extract**

Run: `vp build` in `docs/` (or `vp run build` per docs package scripts)
Expected: built CSS contains `@font-face` for Space Grotesk when showcase themes import

- [ ] **Step 7: Commit**

```bash
git add docs/src/themes/ docs/typestyles-entry.ts docs/public/fonts/
git commit -m "$(cat <<'EOF'
feat(docs): register theme fonts via createDesignTheme

EOF
)"
```

---

### Task 5: Documentation

**Files:**

- Modify: `docs/content/theming/customize.mdx` — short "Self-hosted fonts" section
- Modify: `packages/core/README.md` — mention `fonts` / `defineFonts` / `groteskMono`

- [ ] **Step 1: Add customize.mdx section**

After the "One theme call" section, add:

````mdx
## Self-hosted fonts

Register `@font-face` rules with `fonts` on `createDesignTheme` (or on a
`from` preset). Pair with `tokens.fontFamily` stacks that reference the same
family names. Use `defineFonts` to generate stacks from face definitions:

```ts
import { createDesignTheme, defineFonts, groteskMono } from '@var-ui/core';

const brand = defineFonts({
  sans: {
    face: {
      family: 'Acme Sans',
      src: "url('/fonts/acme-sans.woff2') format('woff2')",
      fontWeight: '400 700',
      fontDisplay: 'swap',
    },
    fallback: 'system-ui, sans-serif',
  },
});

export const acme = createDesignTheme({
  name: 'acme',
  fonts: brand.fonts,
  tokens: { fontFamily: brand.tokens.fontFamily },
});
```

Host font files under your app's `public/fonts/` directory. Root-relative
`url('/fonts/…')` works with Astro, Vite, and Next static serving.
````

- [ ] **Step 2: Add README note under theming**

Brief mention in `packages/core/README.md` near `createDesignTheme` exports listing `fonts`, `defineFonts`, and optional `groteskMono`.

- [ ] **Step 3: Final validation**

Run: `vp check`
Run: `vp test`

- [ ] **Step 4: Commit**

```bash
git add docs/content/theming/customize.mdx packages/core/README.md
git commit -m "$(cat <<'EOF'
docs: document theme-level font-face registration

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement                                     | Task                 |
| ---------------------------------------------------- | -------------------- |
| `fonts` on `DesignThemePreset` / `DesignThemeConfig` | Task 2               |
| `defineFonts` helper                                 | Task 1               |
| Dedup registration                                   | Task 1               |
| Register in `createDesignTheme` before `createTheme` | Task 2               |
| Remove `runtime.ts` hardcoded faces                  | Task 3               |
| `groteskMono` optional export                        | Task 3               |
| Migrate ai-glow / new-wave                           | Task 4               |
| Docs font files + extract entry                      | Task 4               |
| Default theme no `@font-face`                        | Task 3 + Task 2 test |
| Unit + integration tests                             | Tasks 1–2            |
| Docs / README                                        | Task 5               |

## PR grouping (optional)

1. **Core API** — Tasks 1–3
2. **Docs migration** — Task 4
3. **Documentation** — Task 5
