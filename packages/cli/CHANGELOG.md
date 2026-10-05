# @var-ui/cli

## 0.2.0

### Minor Changes

- [#25](https://github.com/var-ui/var-ui/pull/25) [`5c2691b`](https://github.com/var-ui/var-ui/commit/5c2691b38333a3bdae64aea303adcc4bc04b11e0) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - ### Breaking (@var-ui/react)

  - **`DropdownMenu`**, **`ContextMenu`**, and **`MoreMenu`** are removed. Use **`Menu.FromSections`**, **`Menu.ContextMenu`**, and **`Menu.Overflow`** on the `Menu` namespace instead.
  - Root export **`MenuContent`** is removed; use **`Menu.Content`** when composing custom menus.

  ### Breaking (@var-ui/core)
  - **`createDesignTheme({ components: … })`** is removed. After `createDesignTheme`, call **`theme.componentStyles(recipe, override)`** for typed recipe restyles.
  - Theme implementation files live under **`packages/core/src/theme/`**; published export paths (`@var-ui/core/theme-constants`, `./base-styles`, etc.) are unchanged.
  - **`typestyles`** is pinned to **0.25.0** on `@var-ui/core`.
  - **Spinner** recipe uses **`root`** and **`indicator`** slots (update static HTML markup accordingly).

  ### Additions
  - **`@var-ui/astro`**: **`SegmentedControl`** and **`ToggleButton`** with client init scripts.
  - Core **`visuallyHidden`** recipe; side nav, spinner, and TOC align with shared patterns.
  - Docs: unified **Menu** component page, theme-aware **`VarUiWordmark`**, shared **`@var-ui/docs/utils`** syntax highlighting.

  ### Migration (menus)

  ```tsx
  // Before
  <DropdownMenu trigger={<Button>Actions</Button>} sections={[…]} />

  // After
  <Menu.FromSections trigger={<Button>Actions</Button>} sections={[…]} />
  ```

  ### Migration (theming)

  ```ts
  const theme = createDesignTheme({ name: 'acme', extend: { … } });
  theme.componentStyles(button, (t) => ({ base: { borderRadius: t.radius.lg.var } }));
  ```

- [#20](https://github.com/var-ui/var-ui/pull/20) [`eab9dbc`](https://github.com/var-ui/var-ui/commit/eab9dbc29b3d3c5ab1e2f3b2d8f8b1a2dab9bd36) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Add `@var-ui/cli` for agent-readable component docs, and markdown views (`llms.txt`, sibling `.md`, DocsPage link) in `@var-ui/docs`.

- [#24](https://github.com/var-ui/var-ui/pull/24) [`2ce8c1e`](https://github.com/var-ui/var-ui/commit/2ce8c1efd31a661ca42e15edec9586d75f15e852) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Internal TypeStyles cleanup

### Patch Changes

- [#22](https://github.com/var-ui/var-ui/pull/22) [`22802d5`](https://github.com/var-ui/var-ui/commit/22802d58b57ec40b7c8caea3811a210947d546a3) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Publish `@var-ui/core/styles.css` so apps can skip TypeStyles extract setup. `var-ui init` tells agents to import that file.
