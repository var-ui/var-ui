# Theme-level font faces — design

Move `@font-face` registration out of core `runtime.ts` and into the theme
authoring API so self-hosted fonts co-locate with `fontFamily` stacks, core
ships system-font defaults only, and reusable font bundles can be shared across
presets.

**Date:** 2026-07-27  
**Status:** Approved

**Related:** `packages/core/src/runtime.ts`; `packages/core/src/tokens/defaults/fontFamily.ts`;
`docs/src/themes/ai-glow.ts`; `docs/superpowers/specs/2026-07-21-theming-dx-design.md`

---

## Goals

- Let theme authors declare **self-hosted `@font-face` rules** alongside their
  `fontFamily` token overrides.
- **Remove hardcoded font faces** from `runtime.ts` — default theme uses
  system fonts only; no font files required for bare `@var-ui/core` consumers.
- Support **reusable font bundles** via presets (`from`) and a small
  `defineFonts` helper that pairs faces with ready-made stacks.
- Register faces through the existing TypeStyles `global.fontFace` path so
  build-time CSS extraction continues to work unchanged.
- **Deduplicate** identical face definitions when multiple themes or presets
  register the same font.

## Non-goals

- Scoping `@font-face` to a theme class (CSS cannot do this; global faces are
  fine — browsers only download fonts referenced by computed `font-family`).
- CDN / Google Fonts loader integration (allow `url('https://…')` in `src`,
  but no first-class loader API in v1).
- Changing the `fontFamily` token schema to nested `{ face, fallback }`
  objects (stacks stay plain strings for backward compatibility).
- `$fonts.sans` ref resolution inside token values (deferred; stacks remain
  hand-authored or produced by `defineFonts`).
- Italic / multi-file weight matrices beyond what TypeStyles `fontFace` already
  accepts (v1 uses one `FontFaceDefinition` per `@font-face` block; authors
  pass an array of definitions for multiple weights/styles).
- Dev-time validation that every quoted family in `fontFamily` has a matching
  face (warn-only stretch goal, not required for v1).

---

## Locked decisions

| Topic                    | Choice                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| API surface              | Top-level `fonts?: FontFaceDefinition[]` on `DesignThemeConfig` and `DesignThemePreset`  |
| Helper name              | `defineFonts` (not `defineFontPack`)                                                     |
| `fontFamily` token shape | Unchanged — plain CSS `font-family` strings                                              |
| Default theme            | System fonts only; zero `@font-face` rules from core                                     |
| Registration             | `typestyles.global.fontFace()` inside `createDesignTheme`                                |
| Dedup key                | `family` + `fontWeight` + `fontStyle` + normalized `src`                                 |
| Shared bundles           | `defineFonts` returns `{ fonts, tokens: { fontFamily } }` for spread into preset / theme |
| Optional core export     | `groteskMonoFonts` (or similar) as a ready-made `defineFonts` result for docs themes     |

---

## Architecture

```text
defineFonts({ sans: { face, fallback }, mono: { face, fallback } })
        │
        └─ { fonts: FontFaceDefinition[], tokens: { fontFamily: { … } } }

DesignThemePreset / DesignThemeConfig
        │
        ├─ fonts?: FontFaceDefinition[]     // merged: from.fonts + config.fonts
        └─ tokens.fontFamily?: …            // existing deep-merge

createDesignTheme(config)
        │
        ├─ mergedFonts = [...(from?.fonts ?? []), ...(config.fonts ?? [])]
        ├─ for each face: registerFontFace(face)   // deduped globally
        ├─ tokens.createTheme(…)                     // unchanged
        └─ components / extend                       // unchanged
```

`@font-face` rules land in the global CSS layer (same as today). Theme class
scopes only the `--var-ui-font-family-*` custom properties and component styles
that reference them.

---

## Types

```ts
/** Mirrors TypeStyles `global.fontFace` options. */
export type FontFaceDefinition = {
  /** CSS font-family name (quoted in font-family stacks). */
  family: string;
  /** Single src or ordered list, e.g. `url('/fonts/foo.woff2') format('woff2')`. */
  src: string | string[];
  fontWeight?: string | number;
  fontStyle?: string;
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  unicodeRange?: string;
};

export type FontSlotConfig = {
  face: FontFaceDefinition;
  /** CSS fallback suffix after the primary family, without the leading family name. */
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

Extend existing preset / config types:

```ts
export type DesignThemePreset = {
  tokens?: DesignThemeTokenValues;
  colorMode?: DesignThemeColorMode;
  fonts?: FontFaceDefinition[];
};

export type DesignThemeConfig<E extends ExtendMap = Record<string, never>> = {
  // …existing fields…
  fonts?: FontFaceDefinition[];
};
```

---

## `defineFonts`

Pairs `@font-face` definitions with generated `fontFamily` stacks so authors
don't hand-sync family names.

```ts
import { defineFonts } from '@var-ui/core';

export const groteskMono = defineFonts({
  sans: {
    face: {
      family: 'Space Grotesk',
      src: "url('/fonts/space-grotesk-latin.woff2') format('woff2')",
      fontWeight: '300 700',
      fontDisplay: 'swap',
      unicodeRange: 'U+0000-00FF, …',
    },
    fallback: 'ui-sans-serif, system-ui, sans-serif',
  },
  mono: {
    face: {
      family: 'JetBrains Mono',
      src: "url('/fonts/jetbrains-mono-latin.woff2') format('woff2')",
      fontWeight: '100 800',
      fontDisplay: 'swap',
      unicodeRange: 'U+0000-00FF, …',
    },
    fallback: 'ui-monospace, monospace',
  },
});
// groteskMono.fonts      → FontFaceDefinition[]
// groteskMono.tokens.fontFamily → { sans: '"Space Grotesk", ui-sans-serif, …', mono: '…' }
```

Stack generation rule:

```ts
`${JSON.stringify(face.family)}, ${fallback}`;
```

(`JSON.stringify` adds quotes around family names with spaces.)

Usage in a theme:

```ts
const fraunces = {
  family: 'Fraunces',
  src: "url('/fonts/fraunces-latin.woff2') format('woff2')",
  fontWeight: '400 900',
  fontDisplay: 'swap',
};

export const aiGlowTheme = createDesignTheme({
  name: 'ai-glow',
  fonts: [...groteskMono.fonts, fraunces],
  tokens: {
    ...aiGlowPrimitiveValues,
    fontFamily: {
      ...groteskMono.tokens.fontFamily,
      display: '"Fraunces", Georgia, serif',
    },
  },
});
```

Or via preset:

```ts
export const groteskMonoPreset: DesignThemePreset = {
  fonts: groteskMono.fonts,
  tokens: { fontFamily: groteskMono.tokens.fontFamily },
};
```

---

## `createDesignTheme` merge rules

1. **Fonts:** concatenate `from?.fonts` then `config.fonts` (preset first,
   theme additions after). Register each definition once (dedup).
2. **Tokens:** existing `deepMergeThemeOverrides` — `tokens.fontFamily` from
   theme overrides preset as today.
3. **Order of operations:** register font faces **before** `tokens.createTheme`
   so extraction sees them when the theme module is evaluated.

### Dedup registry

Module-level `Set<string>` in `create-theme.ts` (or a small `register-font-face.ts`):

```ts
function fontFaceKey(face: FontFaceDefinition): string {
  const src = Array.isArray(face.src) ? face.src.join('|') : face.src;
  return [face.family, face.fontWeight ?? '', face.fontStyle ?? '', src].join('\0');
}
```

Identical definitions from `groteskMono` shared by `ai-glow` and `new-wave`
produce a single `@font-face` block in extracted CSS.

---

## Core runtime changes

**Remove** from `packages/core/src/runtime.ts`:

```ts
typestyles.global.fontFace('Space Grotesk', { … });
typestyles.global.fontFace('JetBrains Mono', { … });
```

Default `fontFamily` in `tokens/defaults/fontFamily.ts` already uses system
stacks — no change needed.

---

## Docs / examples migration

| Theme                          | Change                                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `ai-glow`                      | `defineFonts` or manual `fonts` for Space Grotesk + JetBrains Mono; add Fraunces face; ensure woff2 files in `docs/public/fonts/` |
| `new-wave`                     | `from: groteskMonoPreset` or spread `groteskMono.fonts`                                                                           |
| `windows-95`, `classic-system` | No faces (system / historical stacks only)                                                                                        |
| `forest`, `rose`, `amber`      | No faces unless stacks change from system fonts                                                                                   |

Add missing `space-grotesk-latin.woff2` (and Fraunces if self-hosting) under
`docs/public/fonts/`. Host apps keep the convention: root-relative
`url('/fonts/…')` matches Astro / Vite static serving.

`docs/typestyles-entry.ts` — no structural change; font faces register when
theme modules calling `createDesignTheme` are imported (ensure theme barrel is
pulled in if not already).

---

## Exports

From `@var-ui/core`:

- `FontFaceDefinition`, `FontSlotConfig`, `DefineFontsInput`, `DefineFontsResult`
- `defineFonts`
- Optional: `groteskMono` (or `groteskMonoPreset`) — convenience for docs;
  not registered automatically; consumers opt in via `from` or spread.

---

## Error handling

- **Invalid `src`:** pass through to TypeStyles; invalid CSS surfaces at extract /
  runtime like any other global CSS.
- **Duplicate registration:** silent dedup (same key).
- **Conflicting registration** (same family, different `src`): last write wins
  at TypeStyles layer; avoid by not reusing family names with different files.
  Document as author responsibility in v1.

---

## Testing

1. **Unit:** `defineFonts` stack strings; dedup registry; merge order
   (`from.fonts` + `config.fonts`).
2. **Integration:** `createDesignTheme({ fonts: [...] })` → extracted CSS
   contains `@font-face` with expected `font-family` and `src`.
3. **Regression:** default theme extract has **no** `@font-face` rules.
4. **Snapshot:** optional snapshot of groteskMono extract fragment for docs
   themes.

---

## Implementation plan (outline)

1. Add types + `defineFonts` + deduped `registerFontFace`.
2. Extend `DesignThemePreset` / `DesignThemeConfig`; wire merge in
   `createDesignTheme`.
3. Remove hardcoded faces from `runtime.ts`.
4. Add `groteskMono` helper + migrate `ai-glow` / `new-wave`.
5. Add font files to `docs/public/fonts/`.
6. Tests + README note under theming docs.

---

## Open questions (non-blocking)

- Ship `groteskMono` from core vs a separate `@var-ui/fonts` entry point?
  **Lean core:** export from core as optional preset helper; revisit split if
  more bundles accumulate.
- Warn when `fontFamily` quotes a family absent from `fonts`? **Defer** —
  useful DX polish, not required for v1.
