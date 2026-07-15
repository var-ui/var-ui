# Component Breadth — Astryx Parity Plan

Cross-reference benchmark: Meta's open-source **Astryx** design system
(`../astryx`, `@astryxdesign/core`). Implements the "Component breadth"
initiative called out in `ROADMAP.md` Future (unscheduled). This spec defines
what "similar completeness" means for var-ui, what to copy from Astryx's
shape, what to deliberately skip, and how to ship it in reviewable phases.

**Relationship to V1–V5:** Component breadth is largely independent of the
theming-engine milestones (V2–V4), but each new recipe should follow the V3
override contract (`c.vars()` for themeable properties) from day one. V5
(theme gallery + var-ui.com) is the natural place to showcase components as
they land — gallery pages can grow incrementally rather than waiting for full
parity.

---

## What we're benchmarking

Astryx splits UI into tiers:

| Tier        | Package                                    | Approx. scope                                                | var-ui equivalent                                                               |
| ----------- | ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Core**    | `@astryxdesign/core`                       | ~95 module families, ~180+ exported React components         | `@var-ui/core` recipes + `@var-ui/react` wrappers                               |
| **Lab**     | `@astryxdesign/lab`                        | Charts, Schedule, Stepper, CodeEditor, SVGIcon (canary-only) | Future `@var-ui/lab` (not started)                                              |
| **Themes**  | `@astryxdesign/theme-*`                    | 7 standalone theme CSS + icon bundles                        | 8 named exports from `@var-ui/core`; icons via `@var-ui/icons` + `IconProvider` |
| **Icons**   | bundled in core + theme packages           | Lucide sets per theme                                        | **`@var-ui/icons`** optional package; `@var-ui/react` has no default glyphs     |
| **Tooling** | `@astryxdesign/cli`, `@astryxdesign/build` | Docs CLI, swizzle, StyleX build                              | Out of scope here (see Future docs/discovery in ROADMAP)                        |

**Target for this spec:** reach **core-tier parity** with Astryx — the
production components an internal-tools product needs for layout, forms,
navigation, overlays, tables, feedback, and chat. Lab-tier visualization
(Chart, Schedule, 3D, Vega) is a separate, later initiative.

---

## Current inventory (var-ui vs Astryx core)

### var-ui today (~22 recipe files, 12 React wrappers)

| Category            | var-ui                                                    | Notes                                                                                               |
| ------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Action**          | Button, Link                                              | No IconButton, ButtonGroup, menus, SegmentedControl, ToggleButton, Toolbar                          |
| **Data input**      | TextField, TextAreaField, Checkbox, Switch, Radio, Select | No Field wrapper, Calendar, date/time pickers, Slider, NumberInput, FileInput, Typeahead, Tokenizer |
| **Feedback**        | Alert, Badge                                              | No Banner, ProgressBar, Spinner, Skeleton, StatusDot                                                |
| **Overlay**         | Dialog, CommandPalette (recipe only)                      | No Toast, Popover, Tooltip, HoverCard, AlertDialog, Lightbox, LayerProvider                         |
| **Navigation**      | Tabs                                                      | No Breadcrumbs, Pagination, SideNav, TopNav, MobileNav, Outline                                     |
| **Table & list**    | —                                                         | No Table, List, TreeList, MetadataList, OverflowList                                                |
| **Layout**          | `layout`/`text` utilities                                 | No AppShell, Grid, Stack primitives, Resizable, Collapsible, FormLayout, Section                    |
| **Content**         | CodeBlock, prose/steps/fileTree (docs)                    | No Avatar, EmptyState, Heading/Text components, Icon, Kbd, Markdown, Thumbnail                      |
| **Container**       | Card (recipe only)                                        | No ClickableCard, SelectableCard, Carousel                                                          |
| **Chat**            | —                                                         | Full Chat suite in Astryx                                                                           |
| **Utility / infra** | DesignSystemProvider, semanticTone                        | No LayerProvider, SizeContext, shared focus/scroll hooks                                            |

### Astryx core categories (reference)

Astryx organizes ~95 families into these doc categories: **Layout**, **Content**,
**Data Input**, **Action**, **Navigation**, **Overlay**, **Table & List**,
**Feedback & Status**, **Container**, **Chat**, **Utility**.

var-ui is strongest in **basic forms**, **code/docs content**, and **theming**.
The largest gaps are **floating UI infrastructure**, **navigation chrome**,
**data tables/lists**, **loading/empty states**, and **chat**.

---

## Definition of done (per component)

Every component that ships as part of this initiative follows the same
checklist — mirroring Astryx's maturity bar without copying StyleX:

1. **Core recipe** in `packages/core/src/components/{name}.ts`
   - `styles.component()` with explicit slots where multi-part
   - Theme-overridable visual props via `c.vars()` (V3 contract)
   - Semantic tones via `semanticTone.ts` where applicable
   - Stable semantic class names (public API once published)
   - Export from `packages/core/src/components/index.ts`

2. **React wrapper** in `packages/react/src/components/{Name}.tsx` when:
   - react-aria-components provides the behavior primitive, **or**
   - the component is interactive and benefits from a typed props surface
   - Static/presentational components (Badge, Kbd, Skeleton) can ship
     core-only initially; add React wrappers when a consumer need appears

3. **Example usage** in `examples/vite-app/src/App.tsx` (or a dedicated
   demo section once the example app outgrows a single file)

4. **Tests** where behavior is non-trivial (keyboard nav, open/close state,
   form validation wiring). Visual-only recipes rely on snapshot/classname
   stability once the eslint rule lands (V3).

5. **Docs** (deferred bulk work): per-recipe `.doc.ts` files and agent
   discovery are a separate ROADMAP item — but each PR should include a
   minimal JSDoc + example in the component's core file until that system
   exists.

**Not required for v1 of each component:** subpath package exports
(`@var-ui/core/Button`), swizzle/CLI, Storybook stories (unless added as part
of V5 site work).

---

## Infrastructure prerequisites (Phase 0)

Several Astryx families are really **shared systems** that many components
depend on. Ship these before large batches of overlays and navigation.

### 0.1 — Field composition pattern

Astryx centralizes labels, descriptions, and validation chrome in `Field` /
`FieldLabel` / `FieldStatus`. var-ui duplicates field chrome across
`textField`, `textAreaField`, `select`, etc.

**Deliver:**

- `field` recipe with slots: `root`, `label`, `description`, `error`
- Refactor existing field recipes to compose field slots (or share a
  `fieldChrome` helper) without breaking public class names
- React: optional `Field` wrapper for custom inputs

**Unlocks:** consistent form layout, faster new input types.

### 0.2 — Floating layer system

Astryx's `LayerProvider` + `useLayer` coordinate z-index, focus trap,
scroll lock, and positioning for Popover, Tooltip, Toast, HoverCard, Select
popovers, Dialog.

**Deliver:**

- `layerProvider` context + hook in `@var-ui/react` (behavior)
- Shared overlay backdrop recipe (`overlay`) in core
- Wire existing `Select` and `Dialog` popovers through the layer system

**Unlocks:** Toast, Popover, Tooltip, HoverCard, AlertDialog, CommandPalette
React wrapper, Lightbox.

### 0.3 — Typography and layout primitives

Promote `layout`/`text` utilities into first-class component recipes where
Astryx has named exports: `Stack` (HStack/VStack), `Grid`, `Section`,
`Center`, `AspectRatio`, `Divider`, `FormLayout`.

**Deliver:**

- `stack`, `grid`, `section`, `divider`, `center`, `aspectRatio` recipes
- React wrappers are thin `className` appliers — low cost, high leverage

**Unlocks:** AppShell, FormLayout, navigation layouts, card grids.

### 0.4 — Icon system

**Decision:** icons are **never bundled inside `@var-ui/react`**. Components
resolve glyphs **only** from `IconProvider`. `@var-ui/react` ships a single
**empty fallback** placeholder (one tiny inline SVG reused for every missing
name) so layout slots stay sized but **zero default-icon payload** lands in
apps that bring their own icon system.

Optional default glyphs live in a separate **`@var-ui/icons`** package
(optional **peer dependency** of `@var-ui/react`). Setup docs show wiring
`IconProvider` with either `@var-ui/icons` or a third-party library.

#### Package split

| Package             | Responsibility                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **`@var-ui/core`**  | `icon` recipe (size/color via `c.vars()`); `IconName` type + `iconNameList` for tooling. No React, no SVGs.                 |
| **`@var-ui/react`** | `IconProvider`, `useIcons()`, `<Icon>`; **one** shared empty fallback node. Peer-depends on `@var-ui/icons` (**optional**). |
| **`@var-ui/icons`** | Default semantic icon map(s) as `ReactNode` — inline SVGs, grows by bundle (see inventory below). No components.            |

```json
// packages/react/package.json (peer dependency shape)
"peerDependencies": {
  "@var-ui/icons": "workspace:^"
},
"peerDependenciesMeta": {
  "@var-ui/icons": { "optional": true }
}
```

Apps that skip `@var-ui/icons` pay no icon SVG cost — only the empty fallback
in react (~tens of bytes). Apps that want var-ui defaults install
`@var-ui/icons` and pass them into `IconProvider` explicitly (not auto-imported
by react, so tree-shaking stays predictable).

#### Core (`@var-ui/core`)

- **`icon` recipe** — styling only: size steps, color via `c.vars()` tied to
  semantic icon tokens (`--var-ui-color-icon-primary`, accent/success/
  warning/danger for status glyphs). No SVG markup in core.
- **`IconName` type** — closed union of **semantic names** var-ui components
  reference internally (`close`, `chevronDown`, `check`, `search`, …).
  Extended in bundles as new components ship (inventory below).

#### React (`@var-ui/react`)

- **`IconProvider`** — **required for any visible icon.** Wraps the app inside
  or alongside `DesignSystemProvider`. Accepts
  `icons: Partial<Record<IconName, ReactNode>>` (partial is fine — unmapped
  names use the empty fallback). Nested providers shallow-merge over parent
  registries for their subtree.
- **`useIcons()`** — read merged registry from context.
- **`<Icon name={…} />`** — looks up `name` in the provider registry; if
  missing, renders the **empty fallback** (same node for every missing name,
  `aria-hidden`, preserves em-box size via the `icon` recipe).
- **`<Icon>{children}</Icon>`** — caller-supplied SVG/node; still applies
  `icon` recipe classes. Escape hatch outside the semantic registry.
- **No `registerIcons()` module API** — provider-only keeps resolution in one
  place and avoids hidden bundle pulls.

var-ui **components** (Select, Alert, CodeBlock, …) call `<Icon name="…" />`
internally — they never import `@var-ui/icons` directly.

#### Icons (`@var-ui/icons`)

- **`defaultIcons`** — export merging all shipped bundles (grows over time).
- **`bundle1Icons`**, **`bundle2Icons`**, … — optional granular imports if an
  app wants a subset before later bundles exist.
- Minimal inline SVGs (~1–2KB for bundle 1), 24×24 viewBox, `currentColor`,
  `aria-hidden`. No Lucide/Heroicons dependency.
- Dev dependency of `@var-ui/react` + `@var-ui/icons` in the monorepo example
  app; **not** a dependency of `@var-ui/core`.

#### Setup (document in README + var-ui.com getting-started)

**1. Required — `IconProvider` (icons come from the provider only):**

```tsx
import { DesignSystemProvider, IconProvider } from '@var-ui/react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemProvider>
      {/* Pass at least an empty object — unmapped names use the empty fallback */}
      <IconProvider icons={{}}>{children}</IconProvider>
    </DesignSystemProvider>
  );
}
```

**2. Optional — var-ui default glyphs (`@var-ui/icons`):**

```bash
pnpm add @var-ui/react @var-ui/core @var-ui/icons
```

```tsx
import { defaultIcons } from '@var-ui/icons';

<IconProvider icons={defaultIcons}>
  <App />
</IconProvider>;
```

**3. Alternative — third-party icon library (no `@var-ui/icons`):**

```tsx
import { X, ChevronDown, Search, CircleCheck, CircleAlert, Info, Copy, Check } from 'lucide-react';
import type { IconName } from '@var-ui/core';

const lucideIcons: Partial<Record<IconName, React.ReactNode>> = {
  close: <X />,
  chevronDown: <ChevronDown />,
  chevronLeft: <ChevronDown style={{ transform: 'rotate(90deg)' }} />,
  chevronRight: <ChevronDown style={{ transform: 'rotate(-90deg)' }} />,
  search: <Search />,
  check: <Check />,
  copy: <Copy />,
  info: <Info />,
  success: <CircleCheck />,
  warning: <CircleAlert />,
  error: <CircleAlert />,
};

<IconProvider icons={lucideIcons}>
  <App />
</IconProvider>;
```

Map every `IconName` your app touches; unmapped names render the empty
fallback (visible as a blank slot — useful signal during integration).

**4. Per-component override** — unchanged; e.g. `<Alert icon={<Custom />} />`
bypasses the registry for that instance.

#### Non-goals

- Bundling default SVGs inside `@var-ui/react` or `@var-ui/core`.
- Theme packages shipping icon bundles (unlike Astryx `@astryxdesign/theme-*`).
- Lab `SVGIcon` (CSS-variable multi-variation SVGs) — future `@var-ui/lab`.

**Unlocks:** IconButton, NavIcon, StatusDot, Alert icons, EmptyState,
Select/Dialog/Toast chrome, command palette search glyph.

**Done when:** `@var-ui/icons` publishes bundle 1; `@var-ui/react` lists it as
optional peer; example app documents all three setup paths; Phase 1–3
components wired to `<Icon name="…" />`.

#### `IconName` inventory

Semantic names describe **function**, not glyph choice (`close` not `x-mark`).
var-ui uses `name` on `<Icon>` (Astryx uses `icon` — same concept, different
prop name).

Names are added in **bundles** so the initial default set stays minimal; extend
the union when a shipping component first references a name.

##### Tone → icon mapping (Alert, Banner, field status)

| var-ui tone / status                         | `IconName`                      | Notes                                                 |
| -------------------------------------------- | ------------------------------- | ----------------------------------------------------- |
| `info`                                       | `info`                          |                                                       |
| `success`                                    | `success`                       |                                                       |
| `warning`                                    | `warning`                       |                                                       |
| `danger`                                     | `error`                         | Same glyph as error; color comes from tone tokens     |
| `tip`                                        | `info`                          | No separate tip glyph in v1; override via `icon` prop |
| Field `success` / `warning` / `error` status | `success` / `warning` / `error` | When field status chrome ships (Phase 0.1+)           |

##### Bundle 1 — ship in `@var-ui/icons` v1 (11 glyphs)

Required by **existing** components once wired to `<Icon name="…" />`, plus
**Phase 1**. Exported as `bundle1Icons`; included in `defaultIcons`.

| `IconName`     | Used by                                                                                           | Today                                   |
| -------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `close`        | Dialog dismiss, Banner dismiss, Thumbnail remove, Toast dismiss (Phase 3)                         | Dialog uses text button; no icon yet    |
| `chevronDown`  | Select trigger, Banner expand, CodeBlock collapse (future), Collapsible (Phase 6)                 | Select has no chevron in trigger        |
| `chevronLeft`  | Carousel prev (Phase 1), Lightbox prev (Phase 3), Pagination (Phase 5)                            | —                                       |
| `chevronRight` | Carousel next (Phase 1), Lightbox next (Phase 3), TreeList expand (Phase 4), Pagination (Phase 5) | —                                       |
| `check`        | CodeBlock copied state, menu item selected, Selector/MultiSelector (Phase 2+)                     | CodeBlock uses text `"Copied"`          |
| `copy`         | CodeBlock copy button                                                                             | CodeBlock uses text `"Copy"`            |
| `search`       | CommandPalette `inputIcon`                                                                        | Slot exists; no glyph rendered          |
| `info`         | Alert/Banner `info` tone, FieldLabel hint (Phase 0.1), Toast default type (Phase 3)               | Alert accepts optional `icon` prop only |
| `success`      | Alert/Banner `success`, field status                                                              | —                                       |
| `warning`      | Alert/Banner `warning`, field status                                                              | —                                       |
| `error`        | Alert/Banner `danger`/`error`, field status                                                       | —                                       |

**Bundle 1 TypeScript union (initial):**

```ts
export type IconName =
  | 'close'
  | 'chevronDown'
  | 'chevronLeft'
  | 'chevronRight'
  | 'check'
  | 'copy'
  | 'search'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
```

**Wire-up PRs** (after Icon infra lands — can be separate from the Icon PR):

| Component                                                                                              | Icons to wire                                                                         | Phase    |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | -------- |
| `CodeBlock`                                                                                            | `copy` / `check` on copy button                                                       | Existing |
| `CommandPalette`                                                                                       | `search` in `inputIcon` slot                                                          | Existing |
| `Select`                                                                                               | `chevronDown` on trigger                                                              | Existing |
| `Dialog`                                                                                               | `close` on dismiss control                                                            | Existing |
| `Alert`                                                                                                | tone → default icon via `Icon`; keep `icon` override prop                             | Existing |
| `Banner`                                                                                               | status icons + `close` + optional expand `chevronDown`                                | Phase 1  |
| `Thumbnail`                                                                                            | `close` on dismiss                                                                    | Phase 1  |
| `Carousel`                                                                                             | `chevronLeft` / `chevronRight`                                                        | Phase 1  |
| `EmptyState`                                                                                           | none required — decorative slot only; consumers pass `<Icon name="…">` or custom node | Phase 1  |
| `Spinner`, `Skeleton`, `ProgressBar`, `StatusDot`, `Kbd`, `Heading`, `Text`, `Avatar`, `Badge`, `Card` | none in v1                                                                            | Phase 1  |

##### Bundle 2 — `@var-ui/icons` v2 (add 6 names)

Ship when Phase 2–3 components land. Append to `defaultIcons`.

| `IconName`       | Used by                                          |
| ---------------- | ------------------------------------------------ |
| `calendar`       | DateInput, DateRangeInput, DateTimeInput         |
| `clock`          | TimeInput, DateTimeInput, Typeahead history      |
| `externalLink`   | Link (off-site indicator)                        |
| `menu`           | MobileNav toggle                                 |
| `moreHorizontal` | MoreMenu overflow trigger                        |
| `arrowUp`        | FileInput upload affordance, Chat send (Phase 7) |

##### Bundle 3 — `@var-ui/icons` v3+ (add when table/nav/chat land)

| `IconName`     | Used by                                                 |
| -------------- | ------------------------------------------------------- |
| `arrowDown`    | Table sort descending, FileInput (if needed)            |
| `arrowsUpDown` | Table unsorted column header                            |
| `funnel`       | Table filter, PowerSearch                               |
| `eyeSlash`     | Column visibility / hidden state (table plugins, demos) |
| `viewColumns`  | Column settings, layout demos                           |
| `checkDouble`  | Chat message delivered/read metadata                    |
| `wrench`       | Chat tool calls                                         |
| `stop`         | Chat send while streaming                               |
| `microphone`   | Chat dictation                                          |

##### Names intentionally excluded from the registry

Pass via `<Icon>` children or component-level `icon` props instead — too
app-specific for semantic defaults:

- `trash`, `edit`, `plus`, brand marks, file-type glyphs, etc.
- Astryx docs mention `icon="x"` in a Link example — **not** a registry name;
  use `close` or a custom SVG.

##### Implementation files (when built)

| File                                         | Package         | Responsibility                                      |
| -------------------------------------------- | --------------- | --------------------------------------------------- |
| `packages/core/src/icons/iconNames.ts`       | `@var-ui/core`  | `IconName` type + `iconNameList` const              |
| `packages/core/src/components/icon.ts`       | `@var-ui/core`  | `icon` recipe (`c.vars()` for size/color)           |
| `packages/icons/src/bundle1.tsx`             | `@var-ui/icons` | Bundle 1 inline SVGs                                |
| `packages/icons/src/defaultIcons.tsx`        | `@var-ui/icons` | Re-exports merged bundles                           |
| `packages/icons/package.json`                | `@var-ui/icons` | Peer: `react`; no dependency on `@var-ui/react`     |
| `packages/react/src/icons/emptyFallback.tsx` | `@var-ui/react` | Single shared placeholder SVG                       |
| `packages/react/src/icons/IconProvider.tsx`  | `@var-ui/react` | Context + shallow merge                             |
| `packages/react/src/icons/Icon.tsx`          | `@var-ui/react` | Provider lookup → fallback / children               |
| `examples/vite-app/…`                        | example         | All three setup paths documented inline             |
| `packages/react/README.md`                   | docs            | Getting-started icon section (copied to var-ui.com) |

**Monorepo wiring:** add `packages/icons` to `pnpm-workspace.yaml`; example
app depends on `@var-ui/icons`; `@var-ui/react` declares optional peer only.

### 0.5 — Shared React hooks

Astryx exports ~15 hooks from `@astryxdesign/core/hooks`. var-ui's hooks barrel
is empty.

**Deliver (incrementally, as needed):**

- `useFocusTrap`, `useScrollLock`, `useMediaQuery` — first wave with layer system
- `useListFocus`, `useTreeFocus`, `useTypeahead` — with List/TreeList/Typeahead
- Re-export from `@var-ui/react/hooks`

---

## Phased component rollout

Phases are ordered by **dependency** and **internal-tools value**, not
alphabetical Astryx parity. Each phase is intended to ship as multiple small
PRs (one component or one infrastructure slice per PR).

### Phase 1 — Feedback, content atoms, and container surfaces (~15 families)

High visual impact, low interaction complexity. Validates `c.vars()` patterns
across tones and motion.

| Priority | Astryx reference                     | var-ui deliverable                                            |
| -------- | ------------------------------------ | ------------------------------------------------------------- |
| P1       | `Spinner`, `Skeleton`, `ProgressBar` | Loading and progress recipes + React wrappers                 |
| P1       | `Banner`                             | Page-level alert banner (extends alert tone system)           |
| P1       | `StatusDot`                          | Semantic dot + optional pulse                                 |
| P1       | `EmptyState`                         | Icon slot + title + description + action                      |
| P1       | `Kbd`, `Heading`, `Text`             | Promote from utilities; align with prose styles               |
| P2       | `Avatar`, `AvatarGroup`              | Image/initials + status dot                                   |
| P2       | `Badge`                              | Add React wrapper (recipe exists)                             |
| P2       | `Card`                               | Add React wrapper; optional `ClickableCard`, `SelectableCard` |
| P2       | `Carousel`                           | Scroll-snap container (CSS-first; minimal JS)                 |
| P2       | `Thumbnail`, `Timestamp`             | Media and time formatting helpers                             |

**Phase 1 done when:** feedback/loading/empty patterns exist; Badge and Card
have React wrappers; typography components are exported as named recipes.

### Phase 2 — Actions, menus, and form expansion (~20 families)

| Priority | Astryx reference                                                        | var-ui deliverable                                                     | Status                                                                                                                                                                                                                                                                                                   |
| -------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | `IconButton`, `ButtonGroup`                                             | Extend button recipe variants                                          | Shipped                                                                                                                                                                                                                                                                                                  |
| P1       | `SegmentedControl`, `ToggleButton`                                      | Selection button groups                                                | Shipped                                                                                                                                                                                                                                                                                                  |
| P1       | `DropdownMenu`, `ContextMenu`, `MoreMenu`                               | Menu recipes on RAC Menu/MenuTrigger                                   | Shipped                                                                                                                                                                                                                                                                                                  |
| P2       | `Toolbar`                                                               | Horizontal action grouping                                             | Shipped — no roving-tabindex/keyboard nav yet, native tab order only                                                                                                                                                                                                                                     |
| P1       | `Slider`, `NumberInput`                                                 | RAC NumberField/Slider                                                 | Shipped                                                                                                                                                                                                                                                                                                  |
| P2       | `FileInput`                                                             | Styled native file input                                               | Shipped — dropzone mode only, no compact inline mode yet                                                                                                                                                                                                                                                 |
| P2       | `InputGroup`, `InputGroupText`                                          | Prefix/suffix chrome                                                   | Shipped — wraps plain `<input>`s via `InputGroupInput`, does not integrate with `TextField`/`NumberInput`                                                                                                                                                                                                |
| P2       | `CheckboxList`, `RadioList`                                             | Build on existing checkbox/radio recipes                               | Shipped as `CheckboxGroup`/`RadioGroup` (options-array API, matching var-ui's existing convention rather than Astryx's children-composition List/ListItem shape)                                                                                                                                         |
| P2       | `Calendar`, `DateInput`, `DateRangeInput`, `DateTimeInput`, `TimeInput` | RAC DatePicker/Calendar (largest single PR cluster — split by control) | Shipped — built directly on RAC `Calendar`/`RangeCalendar`/`DatePicker`/`DateRangePicker`/`TimeField`, values typed via `@internationalized/date` (new dependency)                                                                                                                                       |
| P3       | `Typeahead`, `Tokenizer`                                                | Autocomplete and token input (depends on list focus hooks)             | Shipped — RAC `ComboBox` (Typeahead) and `ComboBox`+`TagGroup` (Tokenizer); no dedicated list-focus hooks needed, RAC provides it                                                                                                                                                                        |
| P3       | `Selector`, `MultiSelector`                                             | Combobox patterns beyond basic Select                                  | `MultiSelector` shipped (RAC `ListBox selectionMode="multiple"` in a popover). `Selector` skipped — functionally redundant with existing `Select`; its extras (nullable/clear, sections/dividers, inline filter, start icon) are candidates for a future `Select` polish pass instead of a new component |
| P3       | `PowerSearch`                                                           | Composite filter UI (defer until Typeahead + Tokenizer land)           | Deferred — Typeahead/Tokenizer have landed, but PowerSearch is a bespoke filter-bar/query-builder composed from Typeahead/Tokenizer/Selector/date inputs rather than a primitive; scope it once there's a real consumer need                                                                             |

**Phase 2 done when:** menu/button variants cover toolbars and segmented
controls; date/time inputs available; combobox patterns beyond Select exist.

### Phase 3 — Overlays and command surfaces (~12 families)

Requires Phase 0.2 (layer system).

| Priority | Astryx reference                  | var-ui deliverable                                         |
| -------- | --------------------------------- | ---------------------------------------------------------- |
| P1       | `Toast`, `useToast`               | Viewport + queue; React hook API                           |
| P1       | `Tooltip`, `Popover`, `HoverCard` | RAC Tooltip/Popover + layer integration                    |
| P1       | `AlertDialog`                     | Confirmation modal variant on dialog recipe                |
| P1       | `CommandPalette`                  | React wrapper (recipe exists)                              |
| P2       | `Lightbox`                        | Full-screen media overlay                                  |
| P2       | `Overlay`                         | Standalone backdrop (if not only internal to dialog/toast) |

**Phase 3 done when:** floating UI stack is complete; toast and command
palette are usable in the example app.

### Phase 4 — Lists, tables, and data display (~10 families)

| Priority | Astryx reference           | var-ui deliverable                                                                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | `List`, `ListItem`, `Item` | Generic list primitives                                                                                                                         |
| P1       | `Table` + subcomponents    | Table recipe with sticky header option                                                                                                          |
| P2       | `MetadataList`             | Key/value display                                                                                                                               |
| P2       | `OverflowList`             | Collapsing horizontal list                                                                                                                      |
| P2       | `TreeList`                 | Hierarchical list (needs tree focus hook)                                                                                                       |
| P3       | Table plugins              | Hooks only: sort, filter, pagination, selection, column resize — mirror Astryx's `useTable*` pattern as `@var-ui/react` hooks, not core recipes |

**Phase 4 done when:** Table and List cover admin UI needs; at least one
table plugin hook ships as proof of extensibility.

### Phase 5 — Navigation and app chrome (~15 families)

| Priority | Astryx reference                   | var-ui deliverable                         |
| -------- | ---------------------------------- | ------------------------------------------ |
| P1       | `Breadcrumbs`                      | RAC Breadcrumbs                            |
| P1       | `Pagination`                       | Page control                               |
| P2       | `SideNav` + subcomponents          | Collapsible sections                       |
| P2       | `TopNav` + mega menu subcomponents | App header chrome                          |
| P2       | `MobileNav`                        | Drawer-style nav                           |
| P2       | `TabList` / `Tab` / `TabMenu`      | Evaluate merge with existing Tabs or alias |
| P3       | `Outline`                          | In-page TOC nav                            |
| P3       | `AppShell`                         | Composes SideNav + TopNav + Layout         |
| P3       | `NavIcon`, `NavMenu`               | Nav-specific icon/menu helpers             |

**Phase 5 done when:** a full admin shell demo exists in the example app
(SideNav + TopNav + AppShell).

### Phase 6 — Layout polish and collapsible regions (~8 families)

| Priority | Astryx reference                                                         | var-ui deliverable                                                 |
| -------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| P2       | `Collapsible`, `CollapsibleGroup`                                        | Expand/collapse panels                                             |
| P2       | `Resizable`, `ResizeHandle`                                              | Split pane layout                                                  |
| P2       | `Layout`, `LayoutHeader`, `LayoutFooter`, `LayoutContent`, `LayoutPanel` | Page regions                                                       |
| P3       | `Blockquote`, `Citation`, `Code`, `Markdown`, `VisuallyHidden`           | Content (some overlap with proseContent — extend, don't duplicate) |

**Phase 6 done when:** layout primitives match Astryx's page-building story;
proseContent and new content components share token paths.

### Phase 7 — Chat (~15 families)

Astryx Chat is a major vertical. Defer until Phases 1–3 land (needs Toast,
layer system, typography, buttons).

| Astryx reference                                                                                                                                                    | var-ui deliverable                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `ChatLayout`, `ChatMessageList`, `ChatMessage`, `ChatMessageBubble`, `ChatComposer`, `ChatComposerInput`, `ChatSendButton`, `ChatSystemMessage`, `ChatToolCalls`, … | New `chat` recipe namespace with sub-exports; React wrappers for composer + message list |

**Phase 7 done when:** example app includes a minimal chat thread demo.

---

## Lab tier (out of scope for core parity)

Track separately as `@var-ui/lab` when core parity is underway:

| Astryx lab module               | Notes                                 |
| ------------------------------- | ------------------------------------- |
| Chart v1/v2, Radial, 3D, Sankey | Heavy deps (D3/WebGL); canary channel |
| `Schedule`                      | Full calendar scheduling UI           |
| `Stepper`                       | Multi-step wizard                     |
| `CodeEditor`                    | Monaco/CodeMirror integration         |
| `SVGIcon`                       | CSS-variable icon variations          |
| `CircularProgress`              | Radial progress                       |
| `ChatReasoning`                 | AI reasoning display                  |
| `@astryxdesign/vega`            | Vega-Lite wrapper                     |

**Graduation rule (from Astryx):** lab → core when a11y, theming (`c.vars()`
audit), and API stability are proven.

---

## Coverage scorecard

Use this table to track progress. "Astryx core families" counts module-level
exports, not every subcomponent.

| Category           | Astryx core | var-ui today | var-ui target |
| ------------------ | ----------- | ------------ | ------------- |
| Layout             | 14          | 2 utilities  | 14            |
| Content            | 16          | 4 (+ prose)  | 16            |
| Data input         | 22          | 6            | 22            |
| Action             | 11          | 2            | 11            |
| Navigation         | 12          | 1            | 12            |
| Overlay            | 11          | 2            | 11            |
| Table & list       | 6           | 0            | 6             |
| Feedback           | 6           | 2            | 6             |
| Container          | 4           | 1            | 4             |
| Chat               | 10          | 0            | 10            |
| Utility/infra      | ~8          | 1            | ~8            |
| **Total families** | **~95**     | **~22**      | **~95**       |

React wrapper target: **≥80%** of interactive core families (Astryx ships
wrappers for nearly all interactive core components).

---

## Architectural constraints (var-ui-specific)

These differ from Astryx and should not be compromised for speed:

1. **TypeStyles, not StyleX** — recipes use `styles.component()` /
   `styles.class()`; theming is CSS custom properties + `data-mode`, not
   `defineTheme()` StyleX compilation.

2. **V3 from day one** — new recipes expose themeable props via `c.vars()`;
   do not bulk-add hard-coded colors that require a later audit.

3. **react-aria-components first** — prefer RAC primitives for focus,
   keyboard, and ARIA semantics; hand-build DOM only for static content
   (Alert, Badge, prose).

4. **Core/lab split** — anything with heavy runtime deps or immature APIs
   goes to `@var-ui/lab` with canary publishing; keep `@var-ui/core` lean.

5. **No separate theme packages yet** — per V5 spec, themes stay named exports
   from core until a concrete consumer need appears.

6. **Engine dependencies** — V2 (generative scales) and V4 (surface tones)
   improve theme quality but do not block individual component PRs; use current
   hand-picked primitives until V2 lands, then revisit token defaults.

---

## Suggested PR cadence and roadmap linkage

Add to `ROADMAP.md` as **V6 — Component breadth** with phases 0–7 as
checklist sections (link PRs per component group).

**Recommended order:**

1. Phase 0 infrastructure (can overlap with V3 classname audit on existing recipes)
2. Phases 1 → 3 (feedback, forms/menus, overlays) — highest ROI for example app
3. Phase 4 (tables/lists) — admin UI completeness
4. Phases 5 → 6 (navigation, layout polish)
5. Phase 7 (chat) — vertical feature
6. Lab tier — parallel track once core hits ~60 families

**Parallel workstreams:**

- V3 `c.vars()` audit on **existing** recipes can proceed alongside Phase 0–1
- V5 site can add a component index page early; grow it per phase
- Per-recipe `.doc.ts` discovery system can start after ~30 core families exist

---

## Explicitly out of scope

- `@var-ui/cli` swizzle/scaffold tooling (Astryx CLI parity)
- Per-component subpath exports synced by script (nice-to-have later)
- Storybook app (unless chosen as var-ui.com docs stack in V5)
- StyleX/build plugin package
- Vega/chart integrations in core
- Translating Astryx's `.doc.mjs` schema verbatim — var-ui may adopt a
  TypeScript-native variant later (see ROADMAP Future)

---

## Open decisions

Record answers here as they are made:

1. **Icon set:** **Decided** — `@var-ui/icons` optional package + `IconProvider`
   (provider-only resolution); single empty fallback in `@var-ui/react`. See §0.4.
2. **Tabs vs TabList:** merge into one API or keep separate (Astryx has both
   `TabList` and patterns overlapping with var-ui `Tabs`)?
3. **Table strategy:** full RAC Table vs. semantic HTML table styled by
   recipes (Astryx uses composable table parts + plugin hooks)?
4. **Chat scope:** full Astryx parity vs. slimmer "message list + composer"
   MVP for v1 of Phase 7?
5. **Lab package timing:** introduce `@var-ui/lab` at first chart/experimental
   component or only after core passes ~60 families?
