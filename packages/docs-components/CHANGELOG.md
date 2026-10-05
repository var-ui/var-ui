# @var-ui/docs-components

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

- [#24](https://github.com/var-ui/var-ui/pull/24) [`2ce8c1e`](https://github.com/var-ui/var-ui/commit/2ce8c1efd31a661ca42e15edec9586d75f15e852) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Internal TypeStyles cleanup

  1.x and 2.x were unpublished; this package is on 0.x until a stable 1.0.

## 0.1.0

### Patch Changes

- Updated dependencies [[`d3f873a`](https://github.com/var-ui/var-ui/commit/d3f873afdc82190dcef49ec37494d70efa1d457d)]:
  - @var-ui/core@0.1.0
  - @var-ui/astro@0.1.0
  - @var-ui/docs@0.1.0

## 0.0.1

### Patch Changes

- [`c28fdba`](https://github.com/var-ui/var-ui/commit/c28fdba598df30e9788d590d19a9cde2851a5dd0) Thanks [@dbanksdesign](https://github.com/dbanksdesign)! - Initial release of the Astro docs kit: `@var-ui/docs` (guide shell, theming, search, TOC) and `@var-ui/docs-components` (optional design-system catalog plugin). Both ship source `.astro`/`.ts` files.

- Updated dependencies [[`e13d16f`](https://github.com/var-ui/var-ui/commit/e13d16f8f8a28f21cf16b416eb00a4e6b89d72dd), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`c28fdba`](https://github.com/var-ui/var-ui/commit/c28fdba598df30e9788d590d19a9cde2851a5dd0), [`629e51b`](https://github.com/var-ui/var-ui/commit/629e51b2754adc3eb9494291511c3b20bc4aa0f8), [`324db6c`](https://github.com/var-ui/var-ui/commit/324db6c5aba6ea74646116f2ca4cd00b74276e23)]:
  - @var-ui/astro@0.0.1
  - @var-ui/core@0.0.1
  - @var-ui/docs@0.0.1
