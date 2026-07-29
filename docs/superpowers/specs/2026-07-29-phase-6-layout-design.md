# Phase 6 — Layout polish and collapsible regions

**Date:** 2026-07-29  
**Status:** Approved (design)  
**Roadmap:** V6 Phase 6 in `ROADMAP.md`

## Summary

Ship Astryx-parity `Layout*` components for multi-pane tool UIs (master-detail
inspectors, start/content/end shells), extend `useResizable` for multi-region
resize, and add first-class responsive panel behavior (`overlay` / `hidden`).
Close the docs gap for `Collapsible` and the new layout family. Astro bindings
cover the static shell only (no resize/overlay interactivity).

**Already shipped (pulled forward — no new work):**

- `Collapsible` / `CollapsibleGroup` (core recipe + React + basic Astro)
- `useResizable` + `ResizeHandle` single-region (wired into `SideNav`)

## Decisions

| Topic        | Decision                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Scope        | Full Astryx `Layout*` parity + multi-region `useResizable`                                                                  |
| Responsive   | `LayoutPanel.responsive={{ below, mode: 'overlay' \| 'hidden' }}`                                                           |
| Astro        | Static shell bindings (`Layout`, `LayoutHeader`, `LayoutFooter`, `LayoutContent`, `LayoutPanel`) — no client resize/overlay |
| Architecture | Monolithic `layout` core recipes + React context (Approach 1)                                                               |
| Delivery     | 2 PRs recommended: (1) core + React + tests, (2) responsive + Astro + docs                                                  |

## Component surface

### Core (`@var-ui/core`)

New recipes in `packages/core/src/components/layout.ts`:

| Export            | Slots                                 |
| ----------------- | ------------------------------------- |
| `layout()`        | `root`, `outer`, `inner`, `middle`    |
| `layoutHeader()`  | `header`, `headerInner`               |
| `layoutFooter()`  | `footer`, `footerInner`               |
| `layoutContent()` | `content`                             |
| `layoutPanel()`   | `panel`, `overlay`, `overlayBackdrop` |

**Variants:** `layout({ height: 'fill' \| 'auto', padding?: SpaceStep })`  
**CSS vars on root:**

- `--var-ui-layout-padding-outer-x` / `-outer-y`
- `--var-ui-layout-padding-inner-x` / `-inner-y`
- `--var-ui-layout-content-width`

**Data attributes on `layout` root** (set by React `Layout`):

- `data-has-header`, `data-has-footer`, `data-has-start`, `data-has-end`
- `data-divider-header`, `data-divider-footer` (when dividers active)

Zone recipes use these attributes for edge-aware padding and divider collapse.

Register all recipes in `components/index.ts` and `themeable-components.ts`.

### React (`@var-ui/react`)

| Export          | Role                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `Layout`        | Shell: `header`, `start`, `content` / `children`, `end`, `footer`; `height`, `contentWidth`, `padding`, `defaultHasDividers` |
| `LayoutHeader`  | Top zone: `hasDivider`, `height`, `padding`                                                                                  |
| `LayoutFooter`  | Bottom zone: same API                                                                                                        |
| `LayoutContent` | Flex-1 scrollable main: `padding`, `isScrollable`, `role`, `label`                                                           |
| `LayoutPanel`   | Side panel: `width`, `hasDivider`, `isScrollable`, `resizable`, `responsive`, `role`, `label`                                |

**React context:**

- `LayoutSlotsContext` — `{ hasHeader, hasFooter, hasStart, hasEnd, defaultHasDividers }`
- `LayoutAreaContext` — `'header' | 'footer' | 'start' | 'end' | 'content'`
- `LayoutDividerContext` — inherited divider default for header/footer

**`LayoutPanel.responsive`:**

```ts
type LayoutPanelResponsive = {
  below: 'sm' | 'md' | 'lg';
  mode: 'overlay' | 'hidden';
};
```

| Mode      | Below breakpoint                                                         | Above breakpoint  |
| --------- | ------------------------------------------------------------------------ | ----------------- |
| `overlay` | RAC `Modal` + `ModalOverlay`, `useScrollLock`, slide from start/end edge | Normal flex panel |
| `hidden`  | Not rendered when `!isOpen`                                              | Normal flex panel |

Open state via `isOpen` / `defaultOpen` / `onOpenChange` on `LayoutPanel`.
In `hidden` mode, consumer provides a toggle (same pattern as `MobileNav.Toggle`).
In `overlay` mode, typically driven by row selection.

**Resize integration:**

```tsx
const { end } = useResizable({
  regions: {
    end: { defaultWidth: 380, minWidth: 320, maxWidth: 480, autoSaveId: 'inspector' },
  },
});

<Layout
  content={
    <LayoutContent padding={0}>
      <Table />
    </LayoutContent>
  }
  end={
    <>
      <LayoutPanel resizable={end} hasDivider padding={0}>
        …
      </LayoutPanel>
      <ResizeHandle {...end.handleProps} />
    </>
  }
/>;
```

Multi-region: independent regions for `start` and `end`, each with its own
`ResizeHandle`. No coordinated split-pane redistribution (matches Astryx).

### `useResizable` extension

Keep existing SideNav API unchanged:

```ts
useResizable(config?: boolean | ResizableConfig): UseResizableResult
```

Add multi-region overload:

```ts
useResizable(config: {
  regions: Record<string, ResizableConfig>;
  autoSaveId?: string; // prefixes: var-ui-resizable:${id}:${regionKey}
}): Record<string, UseResizableResult>
```

`LayoutPanel` accepts full `UseResizableResult` as `resizable` prop; reads
`width` from the result and ignores the `width` prop when provided.

### Astro (`@var-ui/astro`)

Static bindings only — same core recipes, named slots:

- `Layout.astro` — slots: `header`, `start`, `end`, `footer`; default = content
- `LayoutHeader.astro`, `LayoutFooter.astro`, `LayoutContent.astro`, `LayoutPanel.astro`

No `resizable`, no `responsive`, no client scripts. README note: interactive
resize/overlay requires React.

## Out of scope

- Astryx `container` / edge-compensation utilities (Table full-bleed children)
- Vertical split layouts (ResizeHandle supports vertical; wire in follow-up)
- `CollapsibleGroup` Astro binding (nice-to-have, not blocking)
- Astro client islands for resize/overlay

## Padding system

Simplified from Astryx — seamless dividers and `contentWidth` without the full
container-padding bleed system.

- `Layout` `padding` prop sets outer/inner CSS vars (default `space[4]`)
- `LayoutContent` / `LayoutPanel` apply edge-aware padding via root data
  attributes and `LayoutAreaContext`
- `LayoutPanel` `hasDivider` adds border on the content-facing edge; when false,
  negative margin collapses inner padding for seamless flow
- `contentWidth` on `Layout` constrains header/content/footer inner wrappers via
  `--var-ui-layout-content-width` + `margin-inline: auto`

## Testing

| Layer          | Coverage                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Core           | Recipe smoke (slots compile, variants) — `recipes.smoke.test.ts` pattern                        |
| `useResizable` | Multi-region independence, shared `autoSaveId` prefix; existing single-region tests unchanged   |
| `Layout` React | Slot landmarks, resizable width binding, responsive `hidden`/`overlay` with mocked `matchMedia` |
| Astro          | Static 3-zone render in `examples/astro-app`; package test harness if available                 |

## File plan

| Area     | Files                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Core     | `packages/core/src/components/layout.ts`, `index.ts`, `themeable-components.ts`                         |
| React    | `packages/react/src/components/Layout.tsx`, `Layout.test.tsx`; extend `useResizable.ts` + tests         |
| Astro    | `Layout*.astro` (5 files), `packages/astro/index.ts`                                                    |
| Docs     | `layout.mdx`, `layout-panel.mdx`, `collapsible.mdx`; `docs/src/demos/layout/`; `components.ts` registry |
| Examples | Master-detail in `vite-app`; static shell in `astro-app`                                                |
| Roadmap  | Check off Phase 6, link PR                                                                              |

## Implementation order

1. Core `layout*` recipes + CSS var contract
2. Extend `useResizable` multi-region overload
3. React `Layout` family + resize wiring
4. `LayoutPanel` responsive (`overlay` + `hidden`)
5. Astro static bindings
6. Docs, demos, examples
7. Roadmap checkbox

## Reference

- Astryx: `packages/core/src/Layout/` and `packages/core/src/Resizable/`
- var-ui precedents: `appShell.ts`, `useResizable.ts`, `MobileNav.tsx`, `AppShell.astro`
