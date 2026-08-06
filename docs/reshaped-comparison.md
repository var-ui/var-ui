# var-ui vs Reshaped: Gap Analysis

Comparison of the var-ui design system against [Reshaped](https://reshaped.so), a commercially maintained React + Figma design system. Informed by Reshaped v4.1 docs (August 2026) and the local var-ui codebase.

**Date:** August 2026  
**var-ui scale:** ~90 TypeStyles recipes, React/Astro bindings, OKLCH tokens  
**Reshaped scale:** ~36 core components, ~17 utility primitives, 13 hooks, Figma library + CLI theming

---

## Executive summary

Reshaped and var-ui occupy a similar positioning: **lean, token-first design systems** aimed at product teams rather than maximal component catalogs like Mantine or MUI. Reshaped optimizes for **design–code parity** (Figma library, `theme.json` sync, responsive prop syntax). var-ui optimizes for **framework breadth** (Astro/vanilla CSS), **docs/AI app patterns** (chat, code, command palette), and **compile-time theming** via TypeStyles.

Reshaped is not ahead on raw component count — var-ui ships roughly **2× the recipes**, especially in navigation chrome, date/time inputs, and domain-specific chat. Reshaped is ahead on **DX conveniences** (responsive props, RTL, `View`/`Text` layout primitives, ScrollArea, Figma workflow) and **agent/streaming UI** (`LoaderText`).

The strategic choice: stay app-focused and framework-agnostic vs. invest in design-handoff tooling and responsive layout ergonomics. High-signal gaps to watch:

1. **Responsive style props** on layout primitives (`View`-equivalent)
2. **ScrollArea** with edge fading (Reshaped v4.1 pattern)
3. **LoaderText** / streaming-state narration for AI surfaces
4. **RTL** + responsive visibility utilities with SSR
5. **Figma / theme export** workflow (if design partners matter)

---

## Where var-ui is already strong

| Area                    | var-ui advantage                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Architecture**        | Framework-agnostic core (React, Astro, vanilla CSS) vs Reshaped's React-only surface                       |
| **Color science**       | OKLCH-native palette + `generateColors()` with perceptual ramps and contrast calibration                   |
| **A11y foundation**     | React Aria throughout vs Reshaped's custom headless layer                                                  |
| **Bundle/runtime**      | Compile-time TypeStyles CSS extraction; no runtime theme JS required in consumer                           |
| **Component breadth**   | ~90 recipes vs ~36 core Reshaped components — more inputs, overlays, and chrome                            |
| **App patterns**        | Chat suite, `proseContent`, `codeBlock`, `fileTree`, `commandPalette`, `appShell` — tuned for docs/AI apps |
| **Navigation chrome**   | `topNav`, `sideNav`, `mobileNav`, `appShell`, `toc` — Reshaped has no equivalent app shell                 |
| **Date/time depth**     | `calendar`, `dateInput`, `dateRangeInput`, `dateTimeInput`, `timeInput` on RAC + `@internationalized/date` |
| **Data inputs**         | `combobox`, `typeahead`, `tokenizer`, `multiSelector`, `searchInput`, `pinInput`                           |
| **Table tooling**       | Composable sort/selection/pagination/filter/resize hooks — Reshaped ships a presentational `Table` only    |
| **Fixed-tone subtrees** | `data-surface` for light/dark islands independent of global mode                                           |
| **Type safety**         | Typed recipe overrides with full CSS property IntelliSense via TypeStyles                                  |
| **Theme authoring**     | In-docs theme playground with live preview and code export                                                 |

---

## Where Reshaped is already strong

| Area                     | Reshaped advantage                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Design–code parity**   | Matched React + Figma libraries; `theme.json` upload syncs variables to Figma modes                                   |
| **Responsive DX**        | Mobile-first responsive prop syntax on `View`, `Text`, `Hidden`, and most components (`{ s: "column", l: "row" }`)    |
| **Layout primitives**    | `View` (token-aware flexbox + 12-column grid + bleed + divided lists) and `Container`                                 |
| **Theming workflow**     | CLI (`reshaped.config.js` → CSS/JSON/Tailwind), runtime `getThemeCSS()`, `generateThemeColors()` from one brand color |
| **Tailwind integration** | First-class `tailwind.css` output per theme — no manual token bridging                                                |
| **RTL**                  | Built-in `useRTL` + logical properties (`paddingStart`/`End`) across components                                       |
| **SSR visibility**       | `Hidden` utility with responsive hide/show that works server-side                                                     |
| **Agent/streaming UI**   | `LoaderText` — shimmer + cross-fade for narrating in-progress agent steps (v4.1)                                      |
| **Scroll polish**        | `ScrollArea` with edge fade masks; Table horizontal fade via CSS scroll-driven animations                             |
| **Form composition**     | `FormControl` + `useFormControl` for consistent label/helper/error inheritance in custom fields                       |
| **Commercial polish**    | Paid product with dedicated support, Storybook MCP for coding agents, Figma design-agent integration                  |
| **Focus management**     | `TrapFocus`, `useKeyboardMode` (focus ring policy), `useScrollLock` as documented primitives                          |

---

## Component inventory comparison

### var-ui (~90 recipes)

**Actions & navigation:** button, linkButton, buttonGroup, link, menu, toolbar, toggleButton, segmentedControl, breadcrumbs, pagination, commandPalette

**Form inputs:** textField, textAreaField, numberInput, checkbox, radio, switch, select, slider, pinInput, fileInput, inputGroup, combobox, typeahead, tokenizer, multiSelector, searchInput, calendar, dateInput, dateRangeInput, dateTimeInput, timeInput, field

**Feedback:** alert, banner, badge, toast, spinner, skeleton, progressBar, statusDot, emptyState

**Layout:** stack, grid, section, center, aspectRatio, divider, layout, layoutHeader/Footer/Content/Panel, appShell, drawer, resizeHandle

**Content:** heading, textBlock, kbd, proseContent, codeBlock, steps, fileTree, descriptionList, list, outline, toc

**Containers & media:** card, carousel, thumbnail, avatar, avatarGroup, collapsible, overflowList

**Overlay:** dialog, overlay, tooltip, popover, hoverCard, tabs, tabList

**Navigation chrome:** topNav, sideNav, mobileNav

**Data display:** table, tree

**Chat (domain-specific):** chatLayout, chatMessageList, chatMessage, chatMessageBubble, chatComposer, chatSystemMessage, chatToolCalls

### Reshaped (~36 core + ~17 utilities)

Organized at [reshaped.so/docs/getting-started/overview](https://reshaped.so/docs/getting-started/overview):

| Category         | Components                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Actions**      | Button, Link, ToggleButton, ToggleButtonGroup, Menu item                                                          |
| **Navigation**   | Breadcrumbs, Tabs, Pagination                                                                                     |
| **Form inputs**  | Text field, Text area, Number field, Pin field, Checkbox, Radio, Switch, Select, Autocomplete, Slider, FileUpload |
| **Date**         | Calendar (single + range)                                                                                         |
| **Feedback**     | Alert, Toast, Loader, LoaderText, Skeleton, Progress, Progress indicator                                          |
| **Data display** | Table, Badge, Avatar, Card, Carousel                                                                              |
| **Overlays**     | Modal, Popover, Tooltip, Context menu, Dropdown menu                                                              |
| **Layout**       | Divider                                                                                                           |

**Utility components:** Reshaped provider, Accordion, Actionable, Container, Dismissible, Flyout, FormControl (label/helper), Grid, Hidden, Hidden input, Hidden visually, Icon, Image, Overlay, Resizable, Text, Theme

**Hooks (13):** useFormControl, useHandlerRef, useHotkeys, useKeyboardArrowNavigation, useKeyboardMode, useOnClickOutside, useResponsiveClientValue, useRTL, useScrollLock, useTheme, useToggle

### Quick mapping

| Reshaped                                                  | var-ui closest                                                    |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| Button, Link                                              | Button, Link                                                      |
| Text field, Text area, Number field, Select, Autocomplete | TextField, TextAreaField, NumberInput, Select, Typeahead/Combobox |
| Pin field                                                 | PinInput                                                          |
| Checkbox, Radio, Switch, Slider                           | Checkbox, RadioGroup, Switch, Slider                              |
| Modal                                                     | Dialog                                                            |
| Dropdown menu, Context menu                               | Menu                                                              |
| Popover, Tooltip                                          | Popover, Tooltip                                                  |
| Tabs, ToggleButtonGroup                                   | Tabs, SegmentedControl                                            |
| Alert, Toast                                              | Alert, Toast                                                      |
| Badge, Avatar, Card                                       | Badge, Avatar, Card                                               |
| Table, Pagination                                         | Table + hooks, Pagination                                         |
| Calendar                                                  | Calendar (+ dateInput, dateRangeInput, dateTimeInput, timeInput)  |
| Progress indicator                                        | steps (docs-oriented; not a full stepper)                         |
| Loader                                                    | Spinner                                                           |
| LoaderText                                                | — (gap)                                                           |
| FileUpload                                                | fileInput                                                         |
| Carousel                                                  | Carousel                                                          |
| Accordion                                                 | Collapsible (single-panel; no multi-panel accordion)              |
| View, Container, Grid                                     | Stack, Grid, Section, Center, Layout                              |
| Text                                                      | Heading, Text (textBlock)                                         |
| Hidden                                                    | — (gap)                                                           |
| Image                                                     | Thumbnail (limited)                                               |
| ScrollArea                                                | — (gap)                                                           |
| Theme (scoped)                                            | `data-surface`, DesignSystemProvider                              |
| FormControl                                               | Field                                                             |
| Reshaped provider                                         | DesignSystemProvider                                              |

---

## High-priority gaps

Design proposals: [`responsive-layout-props`](superpowers/specs/2026-08-05-responsive-layout-props-design.md) · [`scroll-area`](superpowers/specs/2026-08-05-scroll-area-design.md) · [`loader-text`](superpowers/specs/2026-08-05-loader-text-design.md) · [`rtl-hidden`](superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md) · [`accordion`](superpowers/specs/2026-08-05-accordion-design.md)

### 1. Responsive style props on layout primitives

**Proposal:** [2026-08-05-responsive-layout-props-design.md](superpowers/specs/2026-08-05-responsive-layout-props-design.md)

**Gap:** var-ui layout recipes (`stack`, `grid`, `section`) use static CSS. Breakpoint changes require custom CSS or wrapper components.

**Reshaped provides:** Mobile-first responsive object syntax on `View`, `Text`, `Hidden`, and most components — e.g. `direction={{ s: "column", l: "row" }}`, `gap`, `padding`, `columns`, `hide`.

**var-ui approach:** `Responsive<T>` type + `responsiveRules()` helper emitting SSR-safe `@media` CSS; extend `Stack`/`Grid` first.

### 2. ScrollArea with edge fading

**Proposal:** [2026-08-05-scroll-area-design.md](superpowers/specs/2026-08-05-scroll-area-design.md)

**Gap:** No dedicated scroll container with styled scrollbars and edge fade masks.

**Reshaped provides:** `ScrollArea` with `fade` prop; Table reimplemented horizontal fade on CSS scroll-driven animations (v4.1).

**var-ui approach:** `scrollArea` recipe + React wrapper; CSS scroll-driven fade masks; reuse in `table` and `chatMessageList`.

### 3. LoaderText / streaming narration

**Proposal:** [2026-08-05-loader-text-design.md](superpowers/specs/2026-08-05-loader-text-design.md)

**Gap:** `Spinner` covers indeterminate loading; no first-class component for agent step narration with shimmer → completed cross-fade.

**Reshaped provides:** `LoaderText` — single-line shimmer, optional icon, `completed` + `completedText` cross-fade. Explicitly built for agent/streaming UX.

**var-ui approach:** `loaderText` recipe + `LoaderText` component; wire into `ChatToolCalls` step lists.

### 4. RTL + responsive visibility (SSR-safe)

**Proposal:** [2026-08-05-rtl-hidden-visibility-design.md](superpowers/specs/2026-08-05-rtl-hidden-visibility-design.md)

**Gap:** No `DirectionProvider` or logical property conventions documented; no `hiddenFrom`/`visibleFrom` equivalent.

**Reshaped provides:** `useRTL`, logical `paddingStart`/`End`, `Hidden` with responsive `hide` prop that works with SSR.

**var-ui approach:** `DirectionProvider` + logical-property recipe audit; `Hidden` utility with CSS-only breakpoint hide.

### 5. Accordion (multi-panel)

**Proposal:** [2026-08-05-accordion-design.md](superpowers/specs/2026-08-05-accordion-design.md)

**Gap:** `collapsible` handles single disclosure; no coordinated multi-panel accordion with one-open semantics.

**Reshaped provides:** `Accordion` utility with keyboard navigation and expanded-state management.

**var-ui approach:** `Accordion` compound API on existing RAC `DisclosureGroup` + `collapsible` recipe `accordion` variant.

---

## Medium-priority: components and utilities to add

| Component / utility              | Why                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Image**                        | Lazy load, fallback, aspect ratio — Reshaped ships a dedicated utility; var-ui has `thumbnail` only |
| **Container**                    | Max-width content wrapper with responsive padding — Reshaped's common page constraint               |
| **Hidden / Visible**             | Responsive show/hide with SSR support                                                               |
| **FormControl context**          | `useFormControl` pattern for custom field inheritance (label, error, disabled, required)            |
| **TrapFocus**                    | Documented focus trap for custom overlays                                                           |
| **useKeyboardMode**              | Global focus-ring policy (mouse vs keyboard)                                                        |
| **useHotkeys**                   | Command palette and power-user shortcuts                                                            |
| **Progress indicator (stepper)** | Multi-step flows with state — Reshaped ships this; var-ui `steps` is docs-only                      |
| **Context menu**                 | Pointer-positioned menu — var-ui `menu` may cover this; verify positioning API                      |
| **Dismissible**                  | Removable banners/cards with consistent animation                                                   |

---

## Enhance existing components

### Table — scroll fade + data depth

Reshaped reimplemented horizontal scroll fade with CSS scroll-driven animations. var-ui is already ahead with composable data hooks; add edge-fade scroll and consider sticky columns.

### Collapsible → Accordion

Extend `CollapsibleGroup` with accordion keyboard patterns (Home/End, arrow keys) and `type="single" | "multiple"`.

### Chat / agent surfaces — LoaderText parity

`chatToolCalls` and `chatSystemMessage` are domain-specific advantages. Add shimmer/streaming narration so var-ui matches Reshaped's agent UX without losing chat depth.

### Field / inputs — FormControl inheritance

Standardize description/error/disabled propagation so custom inputs (built on `combobox`) inherit chrome like Reshaped's `useFormControl`.

### Theme playground — export formats

Reshaped exports `theme.json` for Figma sync. Consider JSON/CSS export from the playground for design handoff.

---

## Theming comparison

| Aspect            | Reshaped                                                                   | var-ui                                                               |
| ----------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Engine            | CLI-compiled CSS variables (`--rs-*`) + optional runtime `getThemeCSS()`   | TypeStyles compile-time CSS                                          |
| Theme API         | `reshaped.config.js` → CLI build; `<Reshaped theme="slate">`               | `createDesignTheme()` → class on root                                |
| Color generation  | `generateThemeColors({ primary })` — HSL/HSLuv aligned ramps, light + dark | `generateColors({ accent })` — OKLCH ramps with contrast calibration |
| Color modes       | light/dark via provider; per-area `<Theme>` scoping                        | `colorMode` + `data-surface` fixed-tone subtrees                     |
| Per-component     | Component color props (`color="primary"`) backed by semantic tokens        | `createDesignTheme({ components })` recipe overrides                 |
| Token access      | Direct `var(--rs-color-*)` in CSS/inline styles                            | Semantic tokens via TypeStyles `tokens.color.*`                      |
| Runtime theming   | `getThemeCSS()` + inject `<style>` — user-generated themes                 | Theme config is compile-time; playground generates code              |
| Tailwind bridge   | `tailwind.css` per theme, auto-generated                                   | Not built-in                                                         |
| Figma sync        | `theme.json` upload → Figma variables mode                                 | Not available                                                        |
| Contrast policy   | WCAG or APCA via `colorContrastAlgorithm`                                  | WCAG-oriented contrast in `generateColors()`                         |
| Custom transforms | `transform()` for JS theme output                                          | TypeStyles `extend` namespaces                                       |
| Style props       | `backgroundColor`, `borderColor`, `shadow` on `View`/`Text`                | Not on universal layout primitives                                   |
| Focus ring policy | `useKeyboardMode` global policy                                            | `:focus-visible` per recipe                                          |
| Responsive tokens | Responsive prop syntax on components                                       | Breakpoint tokens only; no responsive props                          |
| RTL               | `useRTL` + logical properties                                              | Not yet                                                              |
| Theme fragments   | `themeFragments` for partial reuse in CLI                                  | `extend` namespaces + `from` preset                                  |

### Reshaped token namespaces

Semantic color roles (`backgroundPrimary`, `foregroundNeutral`, `borderNeutralFaded`, …), `unit` (x1 = 4px base), `radius`, `fontFamily`, `fontWeight`, `font` (typography presets), `shadow`. Colors auto-support dark mode without maintaining parallel style sheets.

### var-ui token namespaces

`palette`, `space`, `size`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `radius`, `borderWidth`, `shadow`, `duration`, `easing`, `transition`, `breakpoint`, `zIndex`, `opacity`, `stroke`, `color.*` (background, text, border, tone, link, code, navItem, ring)

Dark mode via `light-dark()`, `data-mode`, `data-surface`, `DesignSystemProvider`, `useColorMode`, SSR init script.

### Theming philosophy contrast

Reshaped optimizes for **constraints + codegen**: a small semantic token set, CLI output to CSS/JSON/Tailwind, and Figma as a first-class consumer. var-ui optimizes for **authoring flexibility**: typed token trees, OKLCH science, per-recipe CSS overrides, and a live playground — better for teams that theme in code rather than Figma.

---

## Infrastructure & DX gaps

| Feature              | Reshaped                                        | var-ui                                             | Priority                |
| -------------------- | ----------------------------------------------- | -------------------------------------------------- | ----------------------- |
| Figma library        | Full 1:1 React parity                           | None                                               | Low (unless design-led) |
| Responsive props     | Universal on layout + components                | Breakpoint tokens only                             | High                    |
| Tailwind integration | Generated per theme                             | Manual                                             | Medium                  |
| Hooks library        | 13 focused hooks                                | 12 app-specific hooks (table, tree, toc, headroom) | Medium                  |
| Form state           | `useFormControl` inheritance only               | Fields presentational; `@var-ui/form` planned      | High                    |
| Agent DX             | Storybook MCP, Figma design agent, `LoaderText` | Chat components, command palette                   | Medium                  |
| RSC support          | Built-in                                        | Astro islands + React                              | Parity                  |
| CSS-in-JS            | None (CSS variables)                            | None (TypeStyles)                                  | Parity                  |
| Commercial model     | Paid license                                    | Open source (monorepo)                             | Positioning difference  |
| Icons                | Bundled usage in docs                           | Opt-in `IconProvider`                              | Fine as-is              |

### Reshaped integrations

Tailwind CSS, Next.js/Vite, Figma plugin (theme sync), Storybook MCP. No satellite packages — everything ships in `reshaped`.

---

## Suggested roadmap (Reshaped-informed)

### Phase 1 — Layout & agent UX

1. Responsive props on `Stack`/`Grid` (or a `View` primitive)
2. `ScrollArea` with edge fade
3. `LoaderText` for streaming/agent narration
4. `Hidden` / responsive visibility utility (SSR-safe)

### Phase 2 — Accessibility & forms

5. RTL `DirectionProvider` + logical properties in recipes
6. `useFormControl` / field context for custom inputs
7. `Accordion` (multi-panel) on `CollapsibleGroup`
8. `useKeyboardMode` focus-ring policy

### Phase 3 — Design handoff (optional)

9. Theme playground JSON/CSS export (Figma-compatible subset)
10. Tailwind token bridge from compiled theme
11. `Image` utility with lazy load + fallback
12. `Container` max-width wrapper

### Phase 4 — Polish

13. Table horizontal scroll fade (CSS scroll-driven animations)
14. `useHotkeys` for command palette
15. `TrapFocus` as documented utility
16. Stepper / progress indicator for multi-step flows

---

## Architectural differences (summary)

| Dimension       | Reshaped                                           | var-ui                                                      |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| Component count | ~36 core + ~17 utilities                           | ~90 style recipes                                           |
| Paradigm        | React + CSS variables (CLI/runtime)                | TypeStyles recipes + tokens                                 |
| Frameworks      | React (RSC) + Figma                                | React + Astro + vanilla CSS                                 |
| Inputs          | ~12 form fields + Calendar                         | ~18 input-related + full date/time suite                    |
| Theming depth   | CLI codegen, single-color generation, Figma export | OKLCH compile-time tokens, playground, per-recipe overrides |
| Layout DX       | `View`/`Text` with responsive token props          | `stack`/`grid`/`layout` recipes — less prop ergonomics      |
| Domain focus    | General product UI + agent streaming states        | Docs/AI apps (chat, code, nav chrome, command palette)      |
| Hooks           | 13 general-purpose                                 | 12 data/nav focused (table, tree, toc)                      |
| Ecosystem       | Single package + Figma + CLI                       | Core-focused; form package planned                          |

Reshaped is the better reference for **design-system-as-product** workflows — Figma parity, responsive prop ergonomics, and theme export. var-ui is the better fit for **multi-framework docs/AI applications** that need deeper component coverage, OKLCH theming in code, and chat-native patterns. The highest-value imports from Reshaped are not more buttons — they are **ScrollArea**, **LoaderText**, **responsive layout props**, and **RTL/visibility utilities**.
