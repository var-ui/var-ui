# Homeslate → VarUI Migration Gap Analysis

**Date:** August 2026  
**Homeslate path:** `../homeslate`  
**VarUI path:** this repo

This document identifies component, theming, and DX gaps that would create friction if [Homeslate](https://github.com/…) migrated from Mantine 8 to VarUI. It is scoped to what Homeslate actually uses today, not a full Mantine parity checklist.

For a general Mantine comparison, see [mantine-comparison.md](./mantine-comparison.md).

---

## Executive summary

Homeslate is a **moderate Mantine consumer** — 39 of 50 `.tsx` files import `@mantine/*`, covering standard management UI (forms, modals, menus, layout primitives) plus calendar/date widgets. It does **not** use Mantine Table, Notifications, Form, Charts, or Spotlight.

**Migration is feasible for the management shell**, but three areas dominate the risk:

| Area                      | Severity  | Why                                                                                                                                                                                                        |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dual theme system**     | 🔴 High   | Homeslate has a custom DTCG-style `ThemeDocument` → `--token-*` pipeline for display widgets, bridged to Mantine for admin UI. VarUI uses compile-time `createDesignTheme()` with a different token model. |
| **Color editing UI**      | 🔴 High   | `ThemeDocumentManager` (~1,100 lines) depends on Mantine `ColorInput` with swatches. VarUI has no color picker/input.                                                                                      |
| **Calendar/date widgets** | 🟡 Medium | Four calendar widgets use Mantine `Calendar`, `DatePicker`, and `TimeInput` with heavy CSS overrides. VarUI has date primitives but different APIs and less calendar chrome out of the box.                |

Everything else is mostly **straightforward substitution** (Button, Modal→Dialog, Stack/Group→Stack, etc.) with some glue code for missing convenience components (`CopyButton`, `PasswordInput`, `Paper`, `Image`).

Non-Mantine dependencies (`react-grid-layout`, `@dnd-kit`, `@tabler/icons-react`, `qrcode.react`) stay regardless of UI library choice.

---

## Homeslate UI footprint

### Dependencies (UI-related)

| Package               | Role in Homeslate                                  |
| --------------------- | -------------------------------------------------- |
| `@mantine/core`       | Primary component library (41 distinct components) |
| `@mantine/dates`      | `Calendar`, `DatePicker`, `TimeInput`              |
| `@mantine/hooks`      | `useDebouncedValue`, `useElementSize`              |
| `@tabler/icons-react` | All icons (30 files); dynamic icon picker          |
| `react-grid-layout`   | Dashboard widget grid                              |
| `@dnd-kit/*`          | Sortable view list on display detail page          |
| `qrcode.react`        | Share display modal                                |
| `dayjs`               | Calendar widget date math                          |
| `zod`                 | Theme document validation                          |

### Mantine components actually used

**Layout & structure:** `Box`, `Center`, `Group`, `Stack`, `SimpleGrid`, `Paper`, `ScrollArea`, `Divider`, `Collapse`

**Typography & content:** `Text`, `Title`, `Anchor`, `Code`, `Image`

**Actions:** `Button`, `ActionIcon`, `UnstyledButton`, `CopyButton`, `Menu`

**Forms:** `TextInput`, `Textarea`, `NumberInput`, `PasswordInput`, `PinInput`, `Select`, `MultiSelect`, `Switch`, `Slider`, `SegmentedControl`, `ColorInput`

**Feedback:** `Alert`, `Badge`, `Loader`, `Progress`, `Tooltip`

**Overlays:** `Modal`, `Tabs`

**Data display:** `Avatar`, `Breadcrumbs`

**Dates (`@mantine/dates`):** `Calendar`, `DatePicker`, `TimeInput`

**Hooks (`@mantine/hooks`):** `useDebouncedValue` (WeatherWidget search), `useElementSize` (Dashboard grid sizing)

### What Homeslate does _not_ use

Mantine Table, Drawer, Notifications, `@mantine/form`, Charts, Dropzone, Spotlight, Stepper, Accordion, Rating, RingProgress, Affix, Container.

### Custom / domain UI (library-agnostic)

These are Homeslate-specific and would remain custom regardless of UI library:

- `ThemeDocumentManager` — visual theme editor with live preview
- `Dashboard` — `react-grid-layout` widget grid
- `DisplayViewer` — PWA display mode, passcode, view rotation
- `WeekCalendarWidget` — custom time-grid week view (~750 lines)
- Google Calendar / Photos widgets
- `AlarmRuntime`, `AlarmDialog`, voice commands
- `StickyNote`, `HolidayEffects`, `BackgroundSlideshow`
- 15-widget registry with lazy loading

---

## Component mapping

### ✅ Direct or near-direct replacements

| Homeslate (Mantine)             | VarUI equivalent              | Notes                                                               |
| ------------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| `Button`                        | `Button`                      | VarUI has tone/appearance variants; no gradient variant             |
| `ActionIcon`                    | `IconButton`                  | —                                                                   |
| `TextInput`                     | `TextField`                   | —                                                                   |
| `Textarea`                      | `TextAreaField`               | —                                                                   |
| `NumberInput`                   | `NumberInput`                 | —                                                                   |
| `Checkbox` / `Switch` / `Radio` | Same + groups                 | —                                                                   |
| `Select`                        | `Select`                      | VarUI `select` recipe lacks description/error slots — wire manually |
| `MultiSelect`                   | `MultiSelector`               | Same error-slot gap                                                 |
| `Slider`                        | `Slider`                      | No `RangeSlider`                                                    |
| `SegmentedControl`              | `SegmentedControl`            | —                                                                   |
| `PinInput`                      | `PinInput`                    | Both exist                                                          |
| `Modal`                         | `Dialog`                      | Declarative only; no imperative `openModal()`                       |
| `Tabs`                          | `Tabs` + `TabList`            | Tab overflow menu built in                                          |
| `Menu`                          | `DropdownMenu`                | —                                                                   |
| `Tooltip`                       | `Tooltip`                     | —                                                                   |
| `Alert`                         | `Alert`                       | Shared tone system                                                  |
| `Badge`                         | `Badge`                       | No removable `Pill` variant                                         |
| `Loader`                        | `Spinner`                     | No `LoadingOverlay` wrapper                                         |
| `Progress`                      | `ProgressBar`                 | Linear only                                                         |
| `Avatar`                        | `Avatar`                      | No `Indicator` dot overlay                                          |
| `Breadcrumbs`                   | `Breadcrumbs`                 | —                                                                   |
| `ScrollArea`                    | `ScrollArea`                  | Exists; less documented                                             |
| `Collapse`                      | `Collapsible`                 | Single-panel; no multi-item `Accordion`                             |
| `Stack` / `Group`               | `Stack` / `HStack` / `VStack` | No `SimpleGrid` — use `Grid`                                        |
| `Center`                        | `Center`                      | —                                                                   |
| `Divider`                       | `Divider`                     | —                                                                   |
| `MantineProvider`               | `DesignSystemProvider`        | Different theming model (see below)                                 |

### ⚠️ Partial replacements (glue code required)

| Homeslate (Mantine) | VarUI status                       | Friction                                                                             |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| `Paper`             | `Card`                             | Different semantic intent; may need a thin `Paper` wrapper                           |
| `Box`               | None                               | No universal layout primitive; use native elements + CSS modules                     |
| `Text` / `Title`    | `Text` / `Heading`                 | No unified Typography system with `span`/`dimmed`/`truncate` props                   |
| `Anchor`            | `Link`                             | —                                                                                    |
| `Code`              | `Kbd` / inline in `CodeBlock`      | No inline `Code` span component                                                      |
| `Image`             | `Thumbnail` or raw `<img>`         | No responsive/fallback `Image` component                                             |
| `UnstyledButton`    | `Button` with `appearance="ghost"` | Or plain `<button>` + reset styles                                                   |
| `CopyButton`        | Copy logic in `CodeBlock` only     | Build ~20-line wrapper with `navigator.clipboard` + `Tooltip`                        |
| `PasswordInput`     | Missing                            | Use `TextField` with `type="password"`; no show/hide toggle built in                 |
| `TimeInput`         | `TimeInput`                        | Different API (`@internationalized/date` vs Mantine)                                 |
| `Calendar`          | `Calendar`                         | VarUI calendar is RAC-based; Homeslate widgets override Mantine calendar CSS heavily |
| `DatePicker`        | `DateInput`                        | Popover + calendar combo; restyle calendar chrome                                    |
| `ColorInput`        | **Missing**                        | Blocker for `ThemeDocumentManager` unless a third-party picker is added              |

### ❌ No VarUI equivalent (app code or third-party)

| Need                  | Homeslate usage       | Recommendation                                                                                           |
| --------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| `useDebouncedValue`   | WeatherWidget search  | `use-debounce` npm package or 10-line custom hook                                                        |
| `useElementSize`      | Dashboard grid sizing | `ResizeObserver` hook or `@react-hookz/web`                                                              |
| Dynamic icon picker   | `IconPickerModal`     | Keep `@tabler/icons-react`; VarUI `IconProvider` accepts custom glyphs but only ships ~22 semantic icons |
| QR code display       | `ShareDisplayModal`   | Keep `qrcode.react`                                                                                      |
| Dashboard grid        | `Dashboard`           | Keep `react-grid-layout`                                                                                 |
| Drag-and-drop reorder | `DisplayDetailPage`   | Keep `@dnd-kit`                                                                                          |

---

## Theming: the largest friction point

Homeslate runs a **dual theming architecture** that VarUI does not mirror:

```
ThemeDocument (JSON, DTCG-style tokens)
    → resolveTheme(doc, colorMode)
    → ResolvedTheme
    → themeToVars(resolved)          → --token-* CSS vars (display/widgets)
    → mantineThemeFromResolved()     → Mantine createTheme override (admin UI)
```

### What Homeslate's theme system provides

- **8 preset themes** (cosmos, midnight, aurora, sunset, neon, ocean, forest, paper)
- **Foundation tokens:** color scales (brand, neutral, status), spacing, radius, typography, shadow, motion
- **Semantic tokens:** surface, text, border, focus, status, interactive (per light/dark)
- **Component tokens:** widget chrome, toolbar, badge, control overrides
- **Runtime switching:** per-display `colorMode` stored in Zustand, applied via `forceColorScheme` on Mantine and `--token-*` injection on display viewer
- **34 CSS modules** referencing `--token-*` variables for widget styling

### What VarUI provides

- **Compile-time themes** via `createDesignTheme({ name, tokens, colorMode, components, modes })`
- **OKLCH-native** color science with `generateColors({ accent })`
- **Mode support:** `light` / `dark` / `system` via `DesignSystemProvider` + `data-mode`
- **Fixed-tone islands:** `data-surface` for light/dark subtrees
- **Per-component recipe overrides** via typed `components` config
- **No runtime theme document editor API** — themes are TypeScript objects, not JSON validated by Zod

### Specific theming gaps

| Homeslate need                                | VarUI gap                                                 | Impact                                                                         |
| --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Runtime JSON theme documents                  | Themes are compile-time TS                                | `ThemeDocumentManager` cannot map 1:1; needs a VarUI theme bridge or rewrite   |
| `--token-*` CSS variable namespace            | VarUI uses `--var-ui-*` and recipe-level vars             | All 34 widget CSS modules need variable remapping or a compat layer            |
| Mantine `--mantine-color-*` in management CSS | No Mantine bridge                                         | `DisplayDetailPage.module.css`, `ThemeDocumentManager.module.css` need rewrite |
| Per-display theme + color mode                | `DesignSystemProvider` is app-global                      | Display viewer may need scoped theme class or `data-surface` islands           |
| 10-shade color tuples (`brand.50`–`900`)      | `generateColors()` produces ramps but different structure | Bridge function needed (similar to existing `mantineBridge.ts`)                |
| Live theme preview in editor                  | Possible with dynamic class injection                     | No established pattern in VarUI docs                                           |

### Recommended theming approach for migration

1. **Keep the `ThemeDocument` pipeline for display widgets** — it is domain-specific and already decoupled from Mantine via `--token-*`.
2. **Replace `mantineBridge.ts` with `varuiBridge.ts`** — map `ResolvedTheme` → `createDesignTheme()` overrides or runtime CSS variable injection on a scoped container.
3. **Scope admin UI** under a VarUI theme class; scope display viewer under `--token-*` vars (already mostly separate).
4. **Do not try to unify** the two token systems initially — they serve different surfaces (management chrome vs. widget canvas).

---

## Form patterns

Homeslate uses **ad-hoc controlled forms** (no `@mantine/form`). VarUI's `@var-ui/form` `useForm` is a reasonable fit.

| Aspect        | Homeslate today                    | VarUI                                                                                     |
| ------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| Form state    | Local `useState` per field         | `useForm` with `getInputProps`                                                            |
| Validation    | Inline checks + Zod for theme docs | Built-in validators; no Zod resolver                                                      |
| Error display | Mantine input `error` prop         | Works on `TextField`, `PinInput`, `Combobox`; **not** on `Select`/`MultiSelector` recipes |

**Friction:** Widget settings panels (`WidgetPanel.tsx`, modals) use Mantine `Select`/`MultiSelect` with error props. Migrating to VarUI requires either wrapping selects in the standalone `Field` component for error chrome, or waiting for select recipe error slots.

---

## Hooks and DX utilities

| Mantine hook        | Homeslate usage | VarUI                                 |
| ------------------- | --------------- | ------------------------------------- |
| `useDebouncedValue` | 1 file          | Not available — bring own             |
| `useElementSize`    | 1 file          | Not available — `ResizeObserver` hook |
| `useMediaQuery`     | —               | ✅ Available                          |
| `useScrollLock`     | —               | ✅ Available                          |

VarUI ships **2 hooks** vs Mantine's 60+. Homeslate only uses 2 Mantine hooks, so this is a minor gap.

### Missing DX conveniences (general Mantine → VarUI)

These affect Homeslate management pages indirectly:

- No universal `Box` with style props (`m`, `p`, `c`, `bg`)
- No `defaultProps` per component in theme config
- No `unstyled` escape hatch
- No RTL `DirectionProvider`
- No responsive `hiddenFrom` / `visibleFrom` (breakpoint tokens exist but no component props)

Homeslate already uses **CSS modules** heavily (34 files), so the lack of style props is less painful than for Mantine-centric codebases.

---

## Icons

|                | Homeslate                                    | VarUI                                                             |
| -------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| Library        | `@tabler/icons-react` (hundreds of icons)    | `@var-ui/icons` (~22 semantic glyphs) + `IconProvider` for custom |
| Dynamic picker | `IconPickerModal` searches full Tabler set   | Would keep Tabler; VarUI icons are for component chrome only      |
| Display viewer | Dynamic `Icon{Name}` lookup by stored string | Same pattern works with Tabler via `IconProvider` mapping         |

**Recommendation:** Keep Tabler as the icon source. Register a Tabler→VarUI `IconProvider` mapping for components that expect `IconName`, but use Tabler directly in widgets and the icon picker.

---

## Documentation coverage gap

VarUI has ~95 recipes but only **49 documented component pages**. Several components Homeslate would need exist but lack docs/demos:

- `drawer`, `toast`, `appShell`, `sideNav`, `table`, `menu`, `pagination`
- All date/time inputs (`dateInput`, `dateTimeInput`, `dateRangeInput`, `timeInput`, `calendar`)
- `fileInput`, `numberInput`, `scrollArea`, `skeleton`, `segmentedControl`, `multiSelector`

This is a **migration velocity risk** — engineers will need to read source or Storybook-less recipe definitions.

---

## Risk matrix

| Item                               | Severity  | Files affected                 | Mitigation                                                                 |
| ---------------------------------- | --------- | ------------------------------ | -------------------------------------------------------------------------- |
| Theme document bridge              | 🔴 High   | 19 theme files, 34 CSS modules | Build `varuiBridge.ts`; keep `--token-*` for widgets                       |
| `ColorInput` in theme editor       | 🔴 High   | `ThemeDocumentManager.tsx`     | Third-party color picker (e.g. `react-colorful`) or defer editor migration |
| Calendar widget styling            | 🟡 Medium | 5 calendar widget files        | Restyle VarUI `Calendar`/`DateInput`; expect CSS work                      |
| `Select`/`MultiSelect` error slots | 🟡 Medium | Widget settings, alarm editor  | Wrap with `Field` component                                                |
| `CopyButton`                       | 🟢 Low    | 2 files                        | Small custom component                                                     |
| `PasswordInput`                    | 🟢 Low    | 1 file (`StocksWidget`)        | `TextField type="password"` + optional toggle                              |
| `Paper`/`Box`/`Image`              | 🟢 Low    | ~15 files                      | CSS modules + `Card`/native elements                                       |
| Mantine hooks                      | 🟢 Low    | 2 files                        | npm or inline hooks                                                        |
| `Modal` → `Dialog`                 | 🟢 Low    | 6+ modals                      | Mechanical refactor                                                        |
| Icon system                        | 🟢 Low    | 30 files                       | Keep Tabler                                                                |
| Form library                       | 🟢 Low    | —                              | Optional `@var-ui/form` adoption                                           |
| Third-party (grid, dnd, qr)        | ⚪ None   | —                              | Unchanged                                                                  |

---

## Suggested migration phases

docs/homeslate-migration-gaps.md

### Phase 1 — Management shell (low risk)

Migrate pages that use standard form/layout components:

- `AuthPage`, `PairPage`, `DisplayListPage`
- Modals: `RegisterDeviceModal`, `InviteModal`, `ShareDisplayModal`
- `ManagementLayout`, `AddWidgetPanel`

**Estimated scope:** ~15 files, mostly mechanical.

### Phase 2 — Complex management pages

- `DisplayDetailPage` (~990 lines, dnd-kit, theme manager embed)
- `ViewEditorPage`
- `WidgetPanel`, `WidgetWrapper`

**Estimated scope:** ~8 files, moderate CSS rework.

### Phase 3 — Widget chrome (Mantine in widgets)

16 widget files use Mantine mostly for `Loader`, `Text`, `ScrollArea`, `Modal` (settings). Widget _content_ is already styled via `--token-*` CSS modules.

**Strategy:** Replace Mantine primitives in widgets; leave widget layout CSS on `--token-*` untouched.

### Phase 4 — Calendar/date widgets

- `CalendarWidget`, `GoogleCalendarWidget`, `GoogleCalendarMonthWidget`, `GoogleCalendarDayWidget`, `WeekCalendarWidget`
- `AlarmListEditor` (`TimeInput`)

Highest styling effort; consider keeping `@mantine/dates` temporarily for this phase only.

### Phase 5 — Theme editor

- `ThemeDocumentManager` last — depends on `ColorInput` and stable VarUI theming bridge.

---

## VarUI roadmap items that would help most

From [mantine-comparison.md](./mantine-comparison.md) and this analysis, prioritized for Homeslate:

1. **`ColorInput` / `ColorPicker`** — unblocks theme editor migration
2. **Select/MultiSelector field chrome** — error/description slots
3. **`CopyButton`** — generalize from `CodeBlock`
4. **`PasswordInput`** — show/hide toggle variant
5. **Runtime theme override API** — scoped `DesignSystemProvider` or CSS var injection helper for bridging `ThemeDocument`
6. **`useDebouncedValue` / `useElementSize`** — minor but eliminates npm deps
7. **Docs for date/time, drawer, toast, scrollArea** — reduces migration guesswork
8. **`SimpleGrid` or `Grid` span helpers** — replaces Mantine `SimpleGrid` ergonomics

---

## Bottom line

| Question                          | Answer                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Can Homeslate migrate to VarUI?   | **Yes**, with a phased approach                                                                                     |
| Biggest blocker?                  | **Theme editor + dual token bridge**, not component count                                                           |
| How much is mechanical?           | ~60% — standard inputs, modals, layout on management pages                                                          |
| What stays custom?                | Dashboard grid, week calendar, alarms, display viewer, widget registry                                              |
| Can widgets keep current styling? | **Yes** — `--token-*` CSS modules are already Mantine-independent                                                   |
| Should Homeslate wait for VarUI?  | Only for **ColorInput** and **select error slots** if theme editor is in scope; management shell can migrate sooner |
