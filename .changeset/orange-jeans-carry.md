---
'@var-ui/docs-components': minor
'@var-ui/astro': minor
'@var-ui/react': minor
'@var-ui/core': minor
'@var-ui/docs': minor
'@var-ui/cli': minor
---

### Breaking (@var-ui/react)

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
