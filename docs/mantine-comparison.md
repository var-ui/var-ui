# var-ui vs Mantine: Gap Analysis

Comparison of the var-ui design system against [Mantine Core](https://mantine.dev/core/package/), informed by the local Mantine checkout at `../mantine`.

**Date:** July 2026  
**var-ui scale:** ~87 TypeStyles recipes, React/Astro bindings, OKLCH tokens  
**Mantine scale:** ~110 component families, 60+ hooks, 15+ satellite packages

---

## Executive summary

var-ui is not behind Mantine on fundamentals — solid inputs, layout shell, overlays, tables, and a more modern token architecture. The biggest gaps are **ecosystem depth** (forms, combobox primitive, hooks), **variant consistency** (centralized tone resolver), and **~15 common components** (Drawer, Stepper, ScrollArea, Rating, etc.) that Mantine ships out of the box.

The strategic choice: stay lean and app-focused (docs, chat, code) vs. broaden toward general-purpose. Phase 1 priorities (in progress):

1. Shared **variant/tone resolver** across button, badge, alert, banner
2. **Headless Combobox** primitive
3. **`@var-ui/form`** with basic `useForm`
4. **Drawer** component

---

## Where var-ui is already strong

| Area                    | var-ui advantage                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Architecture**        | Framework-agnostic core (Astro, vanilla CSS) vs Mantine's React-only + runtime CSS-in-JS                   |
| **Color science**       | OKLCH-native palette + `generateColors()` accent theming                                                   |
| **A11y foundation**     | React Aria throughout vs Mantine's custom a11y layer                                                       |
| **Bundle/runtime**      | Extracted CSS, no Emotion in consumer bundle                                                               |
| **App patterns**        | Chat suite, `proseContent`, `codeBlock`, `fileTree`, `commandPalette`, `appShell` — tuned for docs/AI apps |
| **Fixed-tone subtrees** | `data-surface` for light/dark islands independent of global mode                                           |
| **Type safety**         | Typed recipe overrides with full CSS property IntelliSense via TypeStyles                                  |

---

## Component inventory comparison

### var-ui (~87 recipes)

**Actions & navigation:** button, linkButton, buttonGroup, link, menu, toolbar, toggleButton, segmentedControl, breadcrumbs, pagination, commandPalette

**Form inputs:** textField, textAreaField, numberInput, checkbox, radio, switch, select, slider, fileInput, inputGroup, typeahead, tokenizer, multiSelector, calendar, dateInput, dateRangeInput, dateTimeInput, timeInput, field

**Feedback:** alert, banner, badge, toast, spinner, skeleton, progressBar, statusDot, emptyState

**Layout:** stack, grid, section, center, aspectRatio, divider, layout, layoutHeader/Footer/Content/Panel, appShell

**Content:** heading, textBlock, kbd, proseContent, codeBlock, steps, fileTree, descriptionList, list, outline, toc

**Containers & media:** card, carousel, thumbnail, avatar, avatarGroup, collapsible, overflowList

**Overlay:** dialog, overlay, tooltip, popover, hoverCard, tabs, tabList

**Navigation chrome:** topNav, sideNav, mobileNav, resizeHandle

**Data display:** table, tree

**Chat (domain-specific):** chatLayout, chatMessageList, chatMessage, chatMessageBubble, chatComposer, chatSystemMessage, chatToolCalls

### Mantine (~110 families)

Organized at [mantine.dev/core/package](https://mantine.dev/core/package/):

| Category           | Components                                                                                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout**         | AppShell, Container, Grid, SimpleGrid, Flex, Stack, Group, Center, Space, AspectRatio, Divider, Splitter, BackgroundImage, Scroller                                                                        |
| **Navigation**     | Tabs, NavLink, Breadcrumbs, Pagination, Stepper, TableOfContents, Anchor, Menu, Menubar, Burger                                                                                                            |
| **Text inputs**    | TextInput, Textarea, NumberInput, PasswordInput, JsonInput, MaskInput, PinInput                                                                                                                            |
| **Combobox**       | Combobox, ComboboxPopover, Select, MultiSelect, TagsInput, Autocomplete, Cascader, NativeSelect, TreeSelect                                                                                                |
| **Boolean/choice** | Checkbox, Radio, Switch, SegmentedControl, Chip, Rating                                                                                                                                                    |
| **Range & color**  | Slider, RangeSlider, AngleSlider, ColorPicker, ColorInput, ColorSwatch                                                                                                                                     |
| **Pills & files**  | Pill, PillsInput, FileInput, FileButton                                                                                                                                                                    |
| **Data display**   | Table, List, Timeline, Card, Badge, Avatar, Image, Blockquote, Highlight, Mark, Code, Kbd, Indicator, ThemeIcon, Text, Title, Typography, DataList, Tree, EmptyState, RollingNumber, OverflowList, Marquee |
| **Feedback**       | Alert, Notification, Loader, Skeleton, Progress, RingProgress, SemiCircleProgress, LoadingOverlay                                                                                                          |
| **Overlays**       | Modal, Drawer, Dialog, HoverCard, Tooltip, Affix, FloatingWindow                                                                                                                                           |
| **Actions**        | Button, ActionIcon, CopyButton, Fieldset, Spoiler                                                                                                                                                          |

### Quick mapping

| Mantine                                               | var-ui closest                                               |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Button, ActionIcon                                    | Button, IconButton                                           |
| TextInput, Textarea, NumberInput, Select, MultiSelect | TextField, TextAreaField, NumberInput, Select, MultiSelector |
| Checkbox, Radio, Switch, Slider                       | Checkbox, RadioGroup, Switch, Slider                         |
| Modal, Drawer                                         | Dialog, Drawer (new), LayoutPanel (overlay)                  |
| Menu, Popover, Tooltip, HoverCard                     | DropdownMenu, Popover, Tooltip, HoverCard                    |
| Tabs, SegmentedControl                                | Tabs, TabList, SegmentedControl                              |
| Alert, Notification                                   | Alert, Toast                                                 |
| Badge, Avatar, Card, Paper                            | Badge, Avatar, Card                                          |
| Table, Pagination                                     | Table + hooks, Pagination                                    |
| AppShell, Navbar, Header                              | AppShell, SideNav, TopNav, MobileNav                         |
| useForm                                               | `@var-ui/form` (new)                                         |
| MantineProvider theme                                 | `createDesignTheme` + `DesignSystemProvider`                 |
| Spotlight                                             | CommandPalette                                               |
| Accordion                                             | Collapsible                                                  |

---

## High-priority gaps (Phase 1 — in progress)

### 1. Form state (`@mantine/form` equivalent)

**Gap:** Fields are presentational only — no `useForm`, validators, nested/array fields, or schema integration.

**Mantine provides:** `useForm`, `useField`, `createFormContext`, built-in validators, `schemaResolver` (Zod/Yup).

**var-ui approach:** `@var-ui/form` with `useForm`, field rules, `getInputProps()` compatible with `FieldMeta`, and built-in validators.

### 2. Headless Combobox primitive

**Gap:** `typeahead`, `select`, `multiSelector`, and `tokenizer` are separate implementations.

**Mantine provides:** Shared `Combobox` primitive with 14 sub-parts + `useCombobox` store.

**var-ui approach:** `combobox` core recipe + `Combobox` React compound API; `Typeahead` refactored to compose it.

### 3. Drawer (first-class)

**Gap:** `LayoutPanel` in overlay mode is closest; `mobileNav` is nav-specific.

**Mantine provides:** `Drawer.Root` / `Overlay` / `Content` / `Header` / `Body`.

**var-ui approach:** General-purpose `drawer` recipe + `Drawer` compound component with placement and size variants.

### 4. Unified variant / tone resolver

**Gap:** Each component defines its own `intent`/`tone`/`appearance` variants independently.

**Mantine provides:** Central `variantColorResolver` maps `color × variant` → paint values across all colored components.

**var-ui approach:** Extend `semanticTone.ts` with `tonePaint()` and `appearanceSurface()` shared by button, badge, alert, banner.

---

## Medium-priority: components to add

| Component                         | Why                                                      |
| --------------------------------- | -------------------------------------------------------- |
| **Stepper**                       | Multi-step flows with state (today `steps` is docs-only) |
| **ScrollArea**                    | Custom scrollbar styling for sidebars, tables, chat      |
| **PasswordInput, PinInput**       | Auth flows                                               |
| **Rating**                        | Reviews, feedback                                        |
| **Chip / Pill**                   | Filter chips, removable tags                             |
| **ColorInput / ColorPicker**      | Theme builders                                           |
| **RangeSlider**                   | Price/date range filters                                 |
| **RingProgress**                  | Dashboards, upload progress                              |
| **Timeline**                      | Activity feeds                                           |
| **NavLink**                       | Sidebar nav with nested children                         |
| **LoadingOverlay**                | Block UI during async ops                                |
| **Image**                         | Lazy load, fallback                                      |
| **Blockquote / Mark / Highlight** | Lighter than full `proseContent`                         |
| **ThemeIcon**                     | Icon in colored circle                                   |
| **CopyButton**                    | Generalize from `codeBlock`                              |
| **Affix**                         | Floating actions, back-to-top                            |
| **Spoiler**                       | Expandable long text                                     |
| **Container**                     | Max-width content wrapper                                |
| **SimpleGrid**                    | Equal-column grids                                       |
| **Accordion**                     | Multi-panel disclosure                                   |

---

## Enhance existing components

### Button / Badge / Alert — unified variant system

Add `outline` and `subtle` appearances consistently via shared `tonePaint()`. Consider `autoContrast` for filled surfaces.

### Input shell — shared field primitive

Standardize description/error on all inputs. Add `clearable` uniformly. Fill the `select` description/error gap.

### Table — data features

Already ahead with composable hooks. Consider column resize, row expansion, sticky columns, `DataTable` convenience wrapper.

### Tabs / SegmentedControl — floating indicator

Port the sliding indicator pattern from `toc` to `tabs` and `segmentedControl`.

### Toast — imperative API

Add `toast.show()`, `update()`, `hide()` by ID alongside `useToast`.

---

## Theming comparison

| Aspect                  | Mantine                                    | var-ui                                     |
| ----------------------- | ------------------------------------------ | ------------------------------------------ |
| Engine                  | Runtime CSS variables + CSS modules        | TypeStyles compile-time CSS                |
| Theme API               | `createTheme()` → `MantineProvider`        | `createDesignTheme()` → class on root      |
| Color modes             | light/dark/auto with manager               | `colorMode` + `data-surface`               |
| Per-component           | `components.X.extend()`                    | `createDesignTheme({ components })`        |
| Style props             | `m`, `p`, `c`, `bg`, responsive on `Box`   | Not on a universal `Box`                   |
| Token extension         | `theme.other`, module augmentation         | `extend` namespaces in `createDesignTheme` |
| Virtual colors          | `virtualColor({ name, light, dark })`      | Not yet — recommended                      |
| Default props           | `Button.extend({ defaultProps })`          | Not yet — recommended                      |
| `unstyled` escape hatch | Per-instance                               | Not yet                                    |
| Gradient variant        | `variant="gradient"`                       | Not yet                                    |
| Focus ring policy       | `focusRing: 'auto' \| 'always' \| 'never'` | `:focus-visible` in recipes only           |
| Responsive visibility   | `hiddenFrom`, `visibleFrom`                | Breakpoint tokens only                     |
| RTL                     | `DirectionProvider`                        | Not yet                                    |

### var-ui token namespaces

`palette`, `space`, `size`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `radius`, `borderWidth`, `shadow`, `duration`, `easing`, `transition`, `breakpoint`, `zIndex`, `opacity`, `stroke`, `color.*`

Dark mode via `light-dark()`, `data-mode`, `data-surface`, `DesignSystemProvider`, `useColorMode`, SSR init script.

---

## Infrastructure & DX gaps

| Feature               | Mantine                             | var-ui                          | Priority   |
| --------------------- | ----------------------------------- | ------------------------------- | ---------- |
| Hooks library         | 60+ in `@mantine/hooks`             | 12 app-specific hooks           | Medium     |
| Imperative modals     | `openModal()`, `openConfirmModal()` | Dialog declarative only         | Medium     |
| Dates package         | Full `@mantine/dates`               | RAC + `@internationalized/date` | Low        |
| Dropzone              | `@mantine/dropzone`                 | `fileInput` simpler             | Medium     |
| Charts                | `@mantine/charts`                   | None                            | Low        |
| Rich text             | `@mantine/tiptap`                   | None                            | Low        |
| Polymorphic `as` prop | `component="a"` on Button, Text     | Limited                         | Medium     |
| Icons                 | Bundled Tabler                      | Opt-in `IconProvider`           | Fine as-is |

### Mantine satellite packages

`@mantine/form`, `@mantine/dates`, `@mantine/modals`, `@mantine/notifications`, `@mantine/spotlight`, `@mantine/carousel`, `@mantine/charts`, `@mantine/dropzone`, `@mantine/tiptap`, `@mantine/code-highlight`, `@mantine/nprogress`, `@mantine/schedule`, `@mantine/colors-generator`

---

## Suggested roadmap

### Phase 1 — Foundation (current)

1. Shared variant/tone resolver
2. Input shell standardization
3. Headless Combobox primitive
4. `@var-ui/form` with basic `useForm`
5. Drawer component

### Phase 2 — Common app needs

6. Stepper, ScrollArea, PasswordInput, PinInput
7. Accordion (multi-panel)
8. Imperative toast API
9. Floating indicator on tabs/segmented control
10. Container, SimpleGrid, LoadingOverlay

### Phase 3 — Polish & ecosystem

11. Rating, Chip, Timeline, NavLink
12. Virtual colors + per-component default props
13. `@var-ui/hooks` package
14. Responsive visibility utilities
15. Polymorphic `as` prop on key components

### Phase 4 — Optional depth

16. ColorInput/ColorPicker, RangeSlider, RingProgress
17. Imperative modals
18. RTL `DirectionProvider`
19. Charts / Dropzone / Rich text (product-dependent)

---

## Architectural differences (summary)

| Dimension       | Mantine                                                  | var-ui                                              |
| --------------- | -------------------------------------------------------- | --------------------------------------------------- |
| Component count | ~110 React families                                      | ~90 style recipes                                   |
| Paradigm        | React + CSS modules + runtime vars                       | TypeStyles recipes + tokens                         |
| Inputs          | 30+ including headless Combobox                          | ~15 input-related                                   |
| Theming depth   | Runtime CSS vars, variant resolver, per-component extend | Compile-time tokens, component overrides            |
| Compound APIs   | Extensive (Modal, AppShell, Combobox, Table)             | Growing (layout shell, Combobox, Drawer)            |
| Hooks           | 60+ in `@mantine/hooks`                                  | 12 in `@var-ui/react`; form hooks in `@var-ui/form` |
| Ecosystem       | 15+ satellite packages                                   | Core-focused + form                                 |

Mantine is a full application UI framework; var-ui is a leaner, compile-time design system optimized for docs/AI app patterns. The biggest architectural gaps beyond Phase 1 are universal style props/`Box`, runtime color scheme conveniences, and the broader satellite package ecosystem.
