# Phase 3 P1 — Overlays and command surfaces

Design for the P1 slice of V6 Phase 3 from `specs/component-breadth.md` /
`ROADMAP.md`. Implements the floating UI stack needed for toast and command
surfaces; defers Phase 3 P2 (`Lightbox`, standalone `Overlay` export).

**Date:** 2026-07-15  
**Status:** Approved for planning  
**Parent:** `specs/component-breadth.md` § Phase 3

---

## Goals

- Ship Toast, Tooltip / Popover / HoverCard, AlertDialog, and a CommandPalette
  React wrapper as four separately reviewable PRs.
- Stay RAC-first (`react-aria-components`) with existing `LayerProvider` /
  `useLayer` z-index allocation — no new positioning libraries.
- Leave unfinished Phase 2 WIP (date cluster, comboboxes, etc.) untouched.
- Make toast and command palette usable in the example app.

## Non-goals

- Phase 3 P2: `Lightbox`, promoting `overlay` as a public standalone React
  surface (the core recipe already exists for composition).
- Finishing or rebasing Phase 2 leftovers.
- Full V3 classname snapshot / lint-rule audit (still use `c.vars()` and never
  rename existing published classes).
- Per-recipe `.doc.ts` structured docs.

## Decisions (locked)

| Topic       | Choice                                                               |
| ----------- | -------------------------------------------------------------------- |
| Scope       | Phase 3 **P1 only**                                                  |
| Phase 2 WIP | Leave alone; build on top                                            |
| Shipping    | **One PR per family**                                                |
| Toast API   | **Hybrid**: declarative primitives + optional `useToast` queue       |
| AlertDialog | **Extend `dialog` recipe** with a confirmation / alertdialog variant |
| Approach    | **RAC-first** shared layer / overlay conventions                     |

## Suggested PR order

1. Toast
2. Floating stack (Tooltip, Popover, HoverCard)
3. AlertDialog
4. CommandPalette

No hard cross-PR dependency; order maximizes learning reuse (queue/portal →
positioned layers → dialog variant → heavier command modal).

---

## Shared conventions

Copied / aligned with prior component-breadth work:

- Core: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })` with
  themeable values via `c.vars()`.
- React: RAC for focus, keyboard, ARIA; hand-rolled DOM only for static chrome.
- Floating layers call `useLayer()` for `z-index` (see `Dialog.tsx`).
- Icons only through `IconProvider` / `<Icon>` — never bundle glyphs in core or
  react. Bundle needs for this phase: `close`, tone icons (`info` / `success` /
  `warning` / danger mapping), `search` for CommandPalette.
- Prefer composing the existing `overlay` recipe slots when a full-viewport
  backdrop is required.
- Exports: core recipes from `packages/core/src/components/index.ts`; React
  components + types from `packages/react/src/components/index.ts` and
  `packages/react/src/index.ts`.
- Validation: `vp check`, `vp test`, build core + react before finishing a PR.
- Example-app demo section for each family under the current gallery pattern.

---

## 1. Toast

### Core

New `toast` recipe with slots roughly:

- `region` — fixed viewport container (placement variants)
- `item` — single toast surface (tone variants)
- `title`, `description`, `close`, optional `progress` / action slot

Tone variants: `info | success | warning | danger`, wired through semantic
tone helpers / vars (same family as Alert / Banner).

### React

**Declarative**

```tsx
<ToastRegion placement="bottom-end">
  <Toast tone="success" title="Saved" description="Draft stored." onDismiss={…} />
</ToastRegion>
```

**Imperative helper (optional)**

```tsx
<ToastProvider>
  <App /> {/* includes <ToastRegion /> once */}
</ToastProvider>

const toast = useToast();
toast.add({ tone: 'info', title: '…', description?, durationMs? });
toast.dismiss(id);
```

### Behavior

- Default duration ~4000ms; `durationMs: 0` (or explicit persistent flag) stays
  until dismiss.
- Pause auto-dismiss while hovered or focused.
- Cap visible queue (e.g. 3); oldest dismisses when over capacity.
- Declarative usage works **without** `ToastProvider`.
- `useToast()` outside a provider throws a clear error.
- Respect `prefers-reduced-motion` for progress / enter animation.

### Tests

- Recipe classnames / tone variants register.
- Add → appear → dismiss; auto-dismiss with fake timers; pause on hover;
  provider error path.

---

## 2. Tooltip, Popover, HoverCard

### Core

Three named recipes (separate public class trees; no shared mega-recipe):

- `tooltip` — non-interactive tip surface
- `popover` — interactive panel chrome (arrow slots deferred)
- `hover-card` — richer non-modal card chrome

All themeable via `c.vars()`. Standalone `popover` does not rename or replace
the per-component popover slots already used by Select / menus / date inputs.

### React

- **Tooltip**: RAC `TooltipTrigger` + `Tooltip`; short content; delay +
  placement props; no interactive children.
- **Popover**: RAC `DialogTrigger` / `Popover` (follow Select / DropdownMenu
  patterns); supports interactive content; optional title.
- **HoverCard**: Popover open-behavior specialized for hover + focus with
  open/close delays; light focus management (not a modal dialog).

Shared:

- `useLayer()` for stacking.
- `portalContainer?: Element` for theme-scoped trees (parity with Dialog /
  Select).

### Tests

- Open/close via hover/focus/press as appropriate.
- Role / accessible name assertions.
- Portal container wiring smoke test where practical.

---

## 3. AlertDialog

### Core

Extend existing `dialog` recipe — **do not** rename existing slots/classes.

Add:

- Variant such as `role: 'dialog' | 'alertdialog'` (default `'dialog'`) for any
  style deltas needed for confirmation chrome.
- Action-row slot (e.g. `actions`) for cancel / confirm layout.

Existing Dialog consumers stay binary-compatible.

### React

`AlertDialog` wrapper:

- Props: `title`, `description`, `cancelLabel`, `confirmLabel`,
  `isDestructive?`, `onConfirm`, controlled `isOpen` / `onOpenChange` and/or a
  trigger.
- Uses RAC alertdialog semantics (`role="alertdialog"`).
- Escape / cancel **never** call `onConfirm`.
- When `isDestructive`, confirm uses danger button intent; **cancel** receives
  initial focus (safer default).
- Reuse Dialog’s ModalOverlay + `useLayer` path.

### Tests

- Confirm fires `onConfirm` and closes.
- Cancel / Escape do not confirm.
- Destructive focus lands on cancel.

---

## 4. CommandPalette

### Core

Existing `commandPalette` recipe is in scope as-is (`open` variant, slots for
backdrop, dialog, input, results, empty, mark, etc.). Avoid class renames.

May wire `search` glyph into the `inputIcon` slot via React (icon registry),
without changing the recipe contract.

Hard-coded `zIndex: 450` on the recipe root should be superseded at the React
layer by `useLayer()` inline style where possible so palettes stack with other
overlays correctly — prefer React override over recipe surgery unless a
follow-up cleanup is cheap and class-stable.

### React

```tsx
<CommandPalette
  isOpen={open}
  onOpenChange={setOpen}
  items={[{ id, title, meta?, keywords? }]}
  onAction={(id) => { … }}
  placeholder="Search…"
  emptyLabel="No results"
  hotkey // default ⌘K / Ctrl+K
/>
```

### Behavior

- Client-side filter on `title` / `meta` / `keywords` by default; optional
  `filter` override.
- Keyboard: ArrowUp/Down, Enter (action + close), Escape (close).
- Empty filter results render the `empty` slot — never crash on `items=[]`.

### Tests

- Filter narrows list; Enter invokes `onAction` with id.
- Escape closes; hotkey opens when enabled.
- Empty state renders.

---

## Example app

Each PR adds a gallery section:

- Toast: buttons that call `useToast` + a mounted region.
- Floating: Tooltip / Popover / HoverCard triggers.
- AlertDialog: confirm + destructive confirm demos.
- CommandPalette: ⌘K demo with a small static item list.

Manual theme smoke across built-in themes is expected before closing the
phase; automated visual regression is out of scope.

---

## Success criteria

Phase 3 P1 is done when:

1. All four families are exported from `@var-ui/core` / `@var-ui/react`.
2. Each has unit tests green under `vp test`.
3. Toast and CommandPalette are demonstrably usable in the example app.
4. ROADMAP Phase 3 checkbox can note P1 shipped (P2 still open).
5. No regressions to existing Dialog / Select / menu floating behavior.

---

## Open follow-ups (explicitly deferred)

- Phase 3 P2: Lightbox + public Overlay React helper.
- Replacing CommandPalette recipe’s fixed `zIndex` with a layer-token approach
  if React-level override proves insufficient.
- Optional toast action buttons / stacking positions beyond the first
  placement set.
- Arrow slots on Popover / Tooltip.

---

## Relationship to other docs

- Breadth inventory & phase table: `specs/component-breadth.md`
- Tracking: `ROADMAP.md` V6 Phase 3
- Implementation plan (next): `plans/YYYY-MM-DD-phase-3-overlays-p1.md` after
  this design is accepted for planning
