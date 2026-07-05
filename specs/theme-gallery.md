# Theme Gallery, Packaging, and var-ui.com — Design-System Layer Spec (V5)

Implements `ROADMAP.md` V5. This started as TypeStyles' P5.5 spec, written
back when `examples/design-system` was an unpublished, workspace-internal
package with no site of its own. Two of that spec's premises are now
different facts, both worth re-deriving rather than copy-pasting the old
verdict:

1. **Publishing is real now.** `@var-ui/core`/`@var-ui/react` are real,
   public npm packages under a real org. The old "no separate theme packages
   — it's not even published" reasoning no longer applies.
2. **var-ui.com is a separate site from TypeStyles' docs**, and doesn't exist
   yet. The old plan (reuse TypeStyles docs' `LiveDemo.astro` component)
   assumed same-repo access to that Astro codebase. It isn't reusable
   directly — var-ui needs its own site, built with whatever stack var-ui.com
   ends up using (not yet decided; this repo's tooling is Vite+/Oxc, not
   necessarily Astro).

---

## Part A — packaging, reconsidered

**Still recommending named exports for now — but for a different reason than
before.** Publishing being possible doesn't mean it's warranted yet. Splitting
8 themes into 8 separate `@var-ui/theme-*` packages means 8 separate
`package.json`s, READMEs, versioning policies, and release surface to
maintain — worth it when there's a demonstrated case for "install a theme
without the component recipes," not speculatively. var-ui's actual
positioning (components _and_ tokens together, easy to theme) points toward
"install `@var-ui/core`, get all 8 themes as named exports, pick one" as the
primary path today.

**Revisit if:** there's an actual request or clear use case for
components-optional theme installs (e.g. someone wants var-ui's color system
with their own component library). Don't split preemptively.

---

## Part B — the actual gap: no site to put a gallery on

Corrected theme count from the original TypeStyles spec: **8** built-in
themes (`default`, `forest`, `rose`, `amber`, `ai-glow`, `new-wave`,
`windows-95`, `classic-system`) — `neo-brutalist-shadows.ts` is a shadow-styling
helper `default.ts` imports, not a theme itself.

The content design carries over from the original spec (it doesn't depend on
which site framework ends up hosting it):

- One entry per theme, showing a small representative sample (a card + a
  button — not a full component audit; that's a separate concern).
- **Each entry shows its theme's light and dark faces simultaneously**, not
  as two separate browsable options — a theme is judged as one identity with
  two faces. This needs `surfaces` (V4) rolled out to all 8 themes first,
  wrapping each face in `data-surface="light"`/`data-surface="dark"`.
- A copy-paste usage snippet per theme. Now that `@var-ui/core` is a real
  published package, this can be a genuine `npm install` + import snippet,
  not the "copy this pattern" framing the old TypeStyles-internal version
  needed.

**What can't carry over:** the interactive comparison UI itself
(`LiveDemo.astro`'s variant-toggle-plus-DOM/CSS/usage-panels pattern) is an
Astro component living in TypeStyles' own docs codebase. It was never
published as a reusable package, and even if it had been, var-ui.com's
framework isn't decided yet. Building the gallery page requires — in order:

1. Deciding var-ui.com's site framework (own task, own spec — out of scope
   here; note it as the actual prerequisite rather than assuming Astro or
   any other stack).
2. Building (or re-deriving, informed by `LiveDemo.astro`'s design but not
   copying its Astro-specific implementation) an equivalent variant-toggle
   comparison component for whatever that stack turns out to be.
3. The gallery page itself, once 1 and 2 exist.

---

## Testing

- A test asserting the demo/gallery data source (however it ends up
  represented once the site framework is chosen) lists exactly the 8 real
  themes from `themes/index.ts` — so adding a 9th theme later and forgetting
  to add its gallery entry fails a test rather than silently under-listing.

---

## Implementation Tasks

### Task 1 — Decide var-ui.com's site framework

Not detailed here — a separate decision/spec. Options include reusing
Astro (matching TypeStyles' docs, at the cost of a second Astro codebase to
maintain) or something else entirely, given this repo's Vite+/Oxc-based
tooling. Write a short spec once there's a real direction.

**Done when:** a framework is chosen and a minimal site skeleton exists.

### Task 2 — Build the comparison component

Re-derive (don't port) a variant-toggle preview component for the chosen
stack. Content requirement: one variant per theme, light+dark faces shown
together via `data-surface`, sample card + button, usage snippet.

**Done when:** the component renders all 8 themes with working toggle and
correct light/dark pairing per theme.

### Task 3 — The gallery page

Host the component on var-ui.com, linked from the site's main nav.

**Done when:** the page is live and reachable from nav.

### Task 4 — Tests

Write the test described in Testing.

**Done when:** `vp test` passes with the new suite.

### Task 5 — Mark shipped

Check off V5 in `ROADMAP.md` with the PR link (or split into sub-items if
Tasks 1–3 end up shipping across multiple PRs, which is likely given Task 1
is a real prerequisite decision).

---

## Explicitly out of scope

- Separate `@var-ui/theme-*` packages — see Part A.
- A full kitchen-sink audit per theme (all components × 8 themes) — the
  gallery's job is quick comparison via one small sample.
- Combining the "palette" and "style" categorizations (see `themes/index.ts`'s
  `designPaletteList`/`designStyleList`, inherited from the original
  TypeStyles docs switcher) into a combinable matrix — these are two labels
  over the same 8 fixed theme objects, not independent axes.
