# var-ui vs Base UI: Gap Analysis

Comparison of the var-ui design system against [Base UI](https://base-ui.com/react/overview/quick-start) (`@base-ui/react` 1.7.0, August 2026). Informed by Base UI handbook pages (Composition, Styling, Animation, Customization, Forms, TypeScript), [llms.txt](https://base-ui.com/llms.txt), and this repo.

**Date:** August 2026  
**var-ui scale:** ~90 TypeStyles recipes, React/Astro bindings, OKLCH tokens, React Aria headless layer  
**Base UI scale:** 37 unstyled React primitives, 4 utilities, no tokens, no CSS

---

## Executive summary

These products occupy **different layers**. Base UI is an unstyled React primitive kit from the Radix / Material UI / Floating UI teams. var-ui is a tokenized design system: TypeStyles recipes, themed React Aria wrappers, Astro, layout, and product patterns (chat, command palette, app shell).

The fair analog for Base UI inside var-ui is **`react-aria-components`**, not `@var-ui/react`. Do not swap primitives. Steal APIs.

On **theming, tokens, layout, and product-shaped components**, var-ui is ahead — Base UI will never ship `createDesignTheme`, AppShell, chat, calendar, or Astro from one recipe source. On **overlay composition, popup animation, form validity, and docs-as-API**, Base UI is the high-water mark and var-ui is behind.

The sharpest example is Dialog: Base UI is `Root / Trigger / Portal / Backdrop / Popup / Title / Close` with a `render` prop on every node. var-ui Dialog is an assembled component that requires `triggerLabel`, `title`, and `description`. Accordion, Combobox, and Layout already prove the better shape in this repo.

**Do not:** become unstyled, replace React Aria with Base UI, drop convenience wrappers, or flatten product components Base UI refuses to ship. Running both headless libraries would double bundle and conflict on focus / scroll-lock.

Specs and implementation plans:

| Spec                                                                                        | Plan                                                             | APIs                                                                                          |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Compound overlay parts](./superpowers/specs/2026-08-21-compound-overlay-parts-design.md)   | [Plan](./superpowers/plans/2026-08-21-compound-overlay-parts.md) | Dialog, AlertDialog, Popover, Tooltip, HoverCard, Menu, Drawer as compound parts + presets    |
| [Popup lifecycle](./superpowers/specs/2026-08-21-popup-lifecycle-design.md)                 | [Plan](./superpowers/plans/2026-08-21-popup-lifecycle.md)        | `data-*` state attrs, animation contract, positioner CSS vars, change-event `reason`/`cancel` |
| [Field parts + validation](./superpowers/specs/2026-08-21-field-parts-validation-design.md) | [Plan](./superpowers/plans/2026-08-21-field-parts-validation.md) | Compound `Field`, native constraint validation, Form primitive                                |

RTL already has a proposal: [DirectionProvider](./superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md).

---

## Where var-ui is already strong

| Area                    | var-ui advantage                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **Theming**             | Typed token tree, `createDesignTheme`, `generateColors`, `light-dark()`, `data-surface`, `c.vars()` tiers |
| **Architecture**        | Framework-agnostic core (React, Astro, vanilla CSS) vs Base UI's React-only surface                       |
| **Color science**       | OKLCH-native palette vs consumer-owned CSS                                                                |
| **A11y dates / i18n**   | RAC + `@internationalized/date` — calendar, date range, time. Base UI has no calendar                     |
| **Bundle/runtime**      | Extracted TypeStyles CSS; public class snapshot contract                                                  |
| **App patterns**        | Chat suite, `proseContent`, `codeBlock`, `fileTree`, `commandPalette`, `appShell`                         |
| **Layout**              | Stack, Grid, AppShell, resizable Layout panels — Base UI ships none of this                               |
| **Icons**               | `IconProvider` + empty fallback; components never bundle SVGs                                             |
| **Convenience APIs**    | `Select(options)`, `AlertDialog(onConfirm)`, `CopyButton` render props — faster than assembling 8 parts   |
| **Class name contract** | Semantic classes are public API; CI guards removals                                                       |

---

## Layer map

Reading top-down: Base UI stops at headless behavior. var-ui owns everything above it — and currently buys headless from Adobe, not MUI.

| Layer             | Base UI                                | var-ui today                                     |
| ----------------- | -------------------------------------- | ------------------------------------------------ |
| Product patterns  | Out of scope (shadcn, Kumo, coss)      | Chat, AppShell, CommandPalette, Table, FileTree  |
| Styled components | Consumer CSS / Tailwind / CSS-in-JS    | `@var-ui/react` wrappers + TypeStyles recipes    |
| Tokens + theming  | None                                   | `createDesignTheme`, `data-mode`, `data-surface` |
| Headless a11y     | **The product**                        | `react-aria-components` (peer)                   |
| Frameworks        | React 17+ (unofficial Solid/Vue ports) | React + Astro from one core recipe source        |

shadcn/ui uses Base UI as its unstyled foundation. var-ui already **is** that styled layer, on a different primitive.

---

## Component inventory

### Base UI (37 primitives + 4 utilities)

**Overlays:** Accordion, Alert Dialog, Collapsible, Context Menu, Dialog, Drawer, Menu, Menubar, Navigation Menu, Popover, Preview Card, Tooltip

**Forms:** Checkbox, Checkbox Group, Field, Fieldset, Form, Input, Number Field, OTP Field, Radio, Select, Slider, Switch, Combobox, Autocomplete

**Display / chrome:** Avatar, Button, Meter, Progress, Scroll Area, Separator, Tabs, Toast, Toggle, Toggle Group, Toolbar

**Utilities:** CSP Provider, Direction Provider, `mergeProps`, `useRender`

### var-ui (~90 recipes)

Covered in [mantine-comparison.md](./mantine-comparison.md). Overlap with Base UI is high on primitives; var-ui additionally ships layout, chat, dates, table, tree, color picker, nav chrome, and docs content primitives.

### Quick mapping

| Base UI                        | var-ui closest                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| Button                         | Button, IconButton                                                                        |
| Input                          | TextField, SearchInput, PasswordInput                                                     |
| Number Field (incl. scrub)     | NumberInput (steppers only)                                                               |
| OTP Field                      | PinInput                                                                                  |
| Checkbox, Checkbox Group       | Checkbox, CheckboxGroup                                                                   |
| Radio, Switch, Slider, Select  | RadioGroup, Switch, Slider, Select                                                        |
| Combobox, Autocomplete         | Combobox, Typeahead                                                                       |
| Field, Fieldset, Form          | Field chrome + `@var-ui/form` `useForm`                                                   |
| Dialog, Alert Dialog           | Dialog, AlertDialog (assembled)                                                           |
| Popover, Tooltip, Preview Card | Popover, Tooltip, HoverCard (assembled)                                                   |
| Menu, Context Menu             | DropdownMenu (`sections[]`), ContextMenu                                                  |
| Drawer                         | Drawer (RAC Modal; no swipe)                                                              |
| Accordion, Collapsible         | Accordion, Collapsible (**compound — keep as template**)                                  |
| Tabs, Toolbar, Toggle Group    | Tabs, TabList, Toolbar, SegmentedControl, ToggleButton                                    |
| Scroll Area, Separator         | ScrollArea, Divider                                                                       |
| Toast                          | Toast + `toast.show()`                                                                    |
| Avatar, Progress               | Avatar, ProgressBar                                                                       |
| Menubar, Navigation Menu       | TopNav / SideNav (product chrome, not the same primitive)                                 |
| Meter                          | ProgressBar (no meter semantics)                                                          |
| `render` / `useRender`         | CopyButton children render prop only                                                      |
| Direction Provider             | Not yet — [existing spec](./superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md) |
| CSP Provider                   | Color-mode init script has no nonce path                                                  |

---

## API quality on overlapping primitives

Inventory overlap is high. The delta is how much of the DOM and lifecycle the consumer can reach.

| Primitive                | Base UI                                                          | var-ui today                                               | Gap                           |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| **Dialog / AlertDialog** | Compound parts + Portal + animation attrs + `eventDetails`       | Assembled chrome; `triggerLabel` / `title` / `description` | Largest DX gap                |
| **Popover / Tooltip**    | Positioner + Arrow + `--available-height` / `--transform-origin` | RAC Popover + `placement` + `LayerProvider` z-index        | No positioner vars, no Arrow  |
| **Field / Form**         | `Field.Root/Label/Control/Error` + native constraint validation  | Per-control `FieldMeta` + lightweight `useForm`            | No validity attrs, no Form    |
| **Drawer**               | Swipe-to-dismiss, snap points, virtual-keyboard scroll           | RAC Modal slide-in; no gesture                             | Mobile gesture (defer)        |
| **Select / Combobox**    | Open parts, grouping, highlight, empty, clear                    | Select is `options[]`; Combobox is already compound        | Select too closed             |
| **Accordion**            | Compound Root/Item/Header/Trigger/Panel                          | Compound on RAC Disclosure                                 | **Parity — overlay template** |
| **Number / OTP**         | Number Field scrub area; dedicated OTP Field                     | NumberInput steppers; PinInput                             | No scrub; PinInput ≈ OTP      |
| **Toast**                | Provider + swipe + `render` on Title/Description/Action          | Queue + Region on RAC ToastQueue                           | Feature-close                 |
| **Menu**                 | Compound Item/Submenu/Radio/Checkbox + `render` on trigger       | `DropdownMenu` + `sections[]`                              | Closed data API               |

---

## High-priority gaps (APIs to borrow)

### 1. Compound overlay parts

**Gap:** Dialog, Popover, Tooltip, HoverCard, AlertDialog, and DropdownMenu hide their DOM. You cannot drop the close button, nest a Tooltip on a Dialog trigger, or swap the trigger for a custom Button without forking.

**Base UI provides:** Every overlay is assembled. `render={<MyButton />}` on Trigger. Nested `render` for Tooltip-on-Dialog-trigger.

**var-ui approach:** Follow Accordion. Export `Dialog.Root` / `Trigger` / `Backdrop` / `Popup` / `Title` / `Description` / `Close` as the canonical API. Keep today's assembled signature as `SimpleDialog` (and equivalents). Stay on RAC. Do not add Base UI as a dependency.

See [compound overlay parts spec](./superpowers/specs/2026-08-21-compound-overlay-parts-design.md).

### 2. Popup lifecycle (state attrs, animation, events)

**Gap:** Overlays unmount immediately. Recipes barely use `data-open` (CommandPalette, MobileNav, Layout). No enter/exit contract, no positioner CSS variables, `onOpenChange` is a bare boolean.

**Base UI provides:**

- `[data-starting-style]` / `[data-ending-style]` for cancellable CSS transitions
- `[data-open]` / `[data-closed]` for keyframes
- Unmount waits on `element.getAnimations()`
- Positioner vars: `--available-height`, `--anchor-width`, `--transform-origin`
- `onOpenChange(open, eventDetails)` with `reason` + `cancel()`

**var-ui approach:** A shared overlay lifecycle helper on top of RAC: public `data-*` attributes, recipe animation that respects `prefers-reduced-motion`, CSS variables from RAC placement, and a typed `ChangeEventDetails` wrapper around RAC `onOpenChange`.

See [popup lifecycle spec](./superpowers/specs/2026-08-21-popup-lifecycle-design.md).

### 3. Field parts + native validation

**Gap:** Each input bakes label/description/error via `FieldMeta`. `Field` is presentational chrome around an unmanaged child. `@var-ui/form` is a values/errors hook — it does not speak Constraint Validation, `data-invalid`, or “focus first invalid field.”

**Base UI provides:** Compound Field around any control; `data-valid` / `data-invalid` / `data-dirty` / `data-touched` / `data-filled`; Form that focuses the first invalid field; works with native `required` / `minLength` and with RHF / TanStack Form.

**var-ui approach:** Compound `Field.Root` / `Label` / `Control` / `Description` / `Error`. Keep `FieldMeta` convenience on TextField et al. Add a thin `Form` that uses native constraint validation and still composes with `useForm`.

See [field parts spec](./superpowers/specs/2026-08-21-field-parts-validation-design.md).

---

## Medium-priority: platform and DX

| Item                       | Why                                                                                                             | Notes                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Handbook docs**          | Base UI teaches the _system_ (Composition, Animation, Forms), not only component pages                          | Getting started is still a stub; add `llms.txt` + View as Markdown      |
| **`isolation: isolate`**   | Portals stack above page `z-index` without an arms race                                                         | Document on app root; keep `LayerProvider` for theme-portal cases       |
| **iOS 26 Safari backdrop** | `position: fixed` no longer covers the visual viewport; Base UI uses `absolute` + `body { position: relative }` | Recipe + getting-started note                                           |
| **DirectionProvider**      | RTL for menus, drawers, placement                                                                               | Existing spec; do not duplicate                                         |
| **CSP nonce**              | Color-mode init script (and any future inline style) needs a nonce path                                         | Defer until a consumer needs it                                         |
| **Select compound parts**  | `options[]` is fine for 80%; custom item rows need parts                                                        | After Dialog/Popover                                                    |
| **Drawer swipe**           | Base UI invested heavily here; RAC Modal will not grow gestures                                                 | Defer; high cost, React-only                                            |
| **Number Field scrub**     | Pointer-drag to change value                                                                                    | Nice-to-have on NumberInput                                             |
| **`useRender` / `render`** | Polymorphism on every part                                                                                      | CopyButton already has a render prop; generalize later if parts need it |

---

## Where Base UI is _not_ a model

| Temptation                         | Why to skip                                                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unstyled / no tokens               | var-ui's product _is_ the visual system                                                                                                           |
| Replace RAC with `@base-ui/react`  | Lose calendar, i18n collections, existing wrappers; two focus managers in one tree                                                                |
| Drop convenience APIs              | `SimpleDialog` / `Select(options)` / `AlertDialog(onConfirm)` are a feature, not a smell                                                          |
| Ship Menubar / Meter / Nav Menu    | TopNav / SideNav / ProgressBar cover the product need; do not clone Base UI's catalog                                                             |
| `mergeProps` as a public primitive | RAC and React already merge; don't add a third prop-merge dialect unless `render` lands                                                           |
| z-index constants forever          | `LayerProvider` exists because theme CSS variables don't cascade through `document.body` portals — fix portals + isolation, don't inflate z-index |

---

## Theming comparison

| Aspect        | Base UI                                               | var-ui                                             |
| ------------- | ----------------------------------------------------- | -------------------------------------------------- |
| Engine        | None (consumer CSS)                                   | TypeStyles compile-time CSS                        |
| Style hooks   | `className`, `style`, both as `state => …`            | Recipe classes + `c.vars()`                        |
| State styling | `[data-checked]`, `[data-open]`, `[data-highlighted]` | Mostly class variants; sparse `data-open`          |
| Animation     | First-class starting/ending attrs + `getAnimations()` | Almost none on overlays                            |
| Positioner    | CSS vars for available size / transform origin        | RAC `placement` only                               |
| Portals       | Document `isolation: isolate` on `.root`              | `UNSTABLE_portalContainer` + `LayerProvider`       |
| Color modes   | Consumer                                              | `data-mode`, `data-surface`, FOUC-safe init script |
| RTL           | `DirectionProvider`                                   | Spec exists, not shipped                           |

---

## Docs & LLM DX

| Feature                | Base UI                                    | var-ui                                      |
| ---------------------- | ------------------------------------------ | ------------------------------------------- |
| Handbook               | Styling, Animation, Composition, Forms, TS | Component pages + thin getting-started      |
| `llms.txt`             | First-class                                | Mentioned in a TypeStyles spec, not shipped |
| View as Markdown       | Every docs page                            | No                                          |
| Per-page API reference | Data attrs + CSS vars listed               | Props tables; class names via recipes       |

---

## Suggested roadmap

### Phase 1 — Overlay APIs (this work)

1. Compound Dialog / AlertDialog / Popover / Tooltip (HoverCard, Menu, Drawer follow the same pattern)
2. Shared popup lifecycle: `data-*`, animation, positioner vars, `ChangeEventDetails`
3. Convenience presets (`SimpleDialog`, keep `DropdownMenu(sections)`, keep `AlertDialog` confirm shape)

### Phase 2 — Fields

4. Compound `Field` parts + validity data attributes
5. `Form` primitive (native constraint validation + focus first invalid)
6. Keep `@var-ui/form` `useForm` as the schema/values helper

### Phase 3 — Platform + docs

7. Getting-started: `isolation: isolate`, iOS 26 backdrop, portal + theme class
8. Handbook pages + `llms.txt` + markdown views
9. Ship [RTL DirectionProvider](./superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md)

### Phase 4 — Optional depth

10. Select compound parts
11. Drawer swipe / NumberInput scrub
12. Generalized `render` prop on overlay triggers
13. CSP nonce for the color-mode script

---

## Architectural differences (summary)

| Dimension       | Base UI                                             | var-ui                                                    |
| --------------- | --------------------------------------------------- | --------------------------------------------------------- |
| Component count | 37 headless primitives                              | ~90 styled recipes + React/Astro bindings                 |
| Paradigm        | Unstyled compound parts + `render`                  | TypeStyles recipes + RAC + assembled _and_ compound APIs  |
| Theming         | None                                                | Compile-time tokens, theme classes, `c.vars()`            |
| Overlays        | Fully open parts, animation protocol, event details | Mostly assembled; Accordion/Combobox/Layout are the model |
| Forms           | Field + Form + native constraint validation         | `FieldMeta` per control + lightweight `useForm`           |
| Docs            | Handbook + llms.txt                                 | Component catalog                                         |
| Ecosystem role  | Primitive layer under shadcn / Kumo / coss          | The styled system (shadcn's job) on RAC                   |

Base UI is a complete **headless** kit with excellent overlay and form contracts. var-ui is a **design system** with a stronger visual and product layer, sitting on React Aria. Treat Base UI as the behavioral spec for floating UI and fields; treat var-ui as the styled, multi-framework system that shadcn would look like if it shipped tokens, Astro, and chat.
