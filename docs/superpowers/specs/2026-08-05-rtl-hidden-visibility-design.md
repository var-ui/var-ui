# RTL direction + SSR-safe responsive visibility

**Date:** 2026-08-05  
**Status:** Proposal  
**Inspired by:** [Reshaped `useRTL`](https://reshaped.so/docs/getting-started/overview), [`Hidden` utility](https://reshaped.so/docs/getting-started/overview)  
**Related:** `DesignSystemProvider`, `data-surface`, `useMediaQuery`, `breakpoint` tokens, layout recipes

## Summary

Two related DX gaps, one design pass:

1. **`DirectionProvider` + `useDirection()`** — document and enforce logical properties (`marginInlineStart`, `paddingInline`, `insetInlineStart`) for RTL support.
2. **`Hidden` utility** — responsive show/hide that works on SSR via CSS media queries (no `useMediaQuery` branch rendering).

## Problem

### RTL

Recipes use physical directions in places (`paddingLeft`, `marginRight`, `textAlign: 'start'` is good where used). There's no:

- Documented `dir` propagation from app root
- Hook for components that must mirror icons/chevrons
- Audit of physical vs logical CSS in core recipes

Reshaped ships `useRTL` and logical prop names (`paddingStart`, `paddingEnd`) on `View`.

### Responsive visibility

Hiding content responsively today requires client hooks:

```tsx
const hideOnMobile = useMediaQuery('(max-width: 767px)');
return hideOnMobile ? null : <Sidebar />;
```

This causes SSR/client mismatch (content flash or hydration warning). Reshaped's `Hidden` renders markup always but applies `display: none` via breakpoint CSS.

## Goals

| Goal                   | Detail                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Direction context**  | `dir="ltr" \| "rtl"` on `DesignSystemProvider` → `document.documentElement.dir`  |
| **`useDirection()`**   | Returns `{ direction, isRtl }` for icon mirroring and layout                     |
| **Logical properties** | v1 audit + fix high-traffic recipes (`sideNav`, `menu`, `layout`, `collapsible`) |
| **`Hidden` SSR-safe**  | `hide={{ sm: true, md: false }}` → CSS-only visibility                           |
| **Pair utility**       | `Visible` as alias inversion (optional sugar)                                    |

## Non-goals (v1)

- Automatic locale detection (caller's responsibility)
- Mirroring every SVG icon in the icon set (document `data-mirror` pattern for directional icons)
- `paddingStart` style props on layout primitives (defer to logical CSS in recipes)
- Astro i18n routing integration

## Proposed API

### Direction

```tsx
// packages/react/src/providers/DirectionProvider.tsx
export type Direction = 'ltr' | 'rtl';

export type DirectionProviderProps = {
  direction?: Direction;
  children: ReactNode;
};

export function DirectionProvider({ direction = 'ltr', children }: DirectionProviderProps);

export function useDirection(): { direction: Direction; isRtl: boolean };
```

Integrate with existing `DesignSystemProvider`:

```tsx
<DesignSystemProvider theme={theme} direction="rtl">
```

Provider sets `dir` on a wrapping element (or merges with theme root) and provides context.

**Icon mirroring convention:**

```tsx
<Icon name="chevronRight" data-mirror={isRtl || undefined} />
```

Recipe:

```css
[data-mirror] {
  transform: scaleX(-1);
}
```

### Hidden utility

```tsx
// packages/core/src/components/hidden.ts — recipe
// packages/react/src/components/Hidden.tsx

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** true = hidden at this breakpoint and up (mobile-first hide). */
export type HiddenMap = Partial<Record<Breakpoint, boolean>>;

export type HiddenProps = {
  children: ReactNode;
  /**
   * When true, element is display:none at all sizes.
   * When object, mobile-first: hidden from listed breakpoint upward.
   * Reshaped-compatible: `hide={{ s: false, m: true }}` maps to our sm/md.
   */
  hide?: boolean | HiddenMap;
  /** Inverse of hide — visible only at listed breakpoints. */
  visible?: boolean | HiddenMap;
  /** Render as different element. @default 'div' */
  as?: ElementType;
  className?: string;
};
```

### CSS generation (`hiddenResponsive()`)

Mobile-first hide from breakpoint `{ md: true }`:

```css
.hidden--md-up {
  display: none;
}
@media (min-width: 768px) {
  .hidden--md-up {
    display: none;
  }
}
```

For `hide={{ sm: false, md: true }}` (visible on sm, hidden md+):

```css
/* base (sm): display contents or block */
.hidden-responsive-abc {
  display: block;
}
@media (min-width: 768px) {
  .hidden-responsive-abc {
    display: none !important;
  }
}
```

Use `display: none` / revert pattern; `visibility: hidden` only if screen-reader semantics need preservation (see variant below).

### Screen-reader-only mode (future slot)

Reshaped has `Hidden visually` separate from `Hidden`. var-ui can defer `VisuallyHidden` recipe (may already exist in patterns) — note in docs, don't block v1.

## Recipe audit (RTL v1)

Priority files to convert physical → logical:

| Recipe                   | Changes                                              |
| ------------------------ | ---------------------------------------------------- |
| `sideNav`                | `paddingInline`, `borderInlineEnd`, chevron rotation |
| `menu`                   | submenu offset `insetInlineStart`                    |
| `layout` / `layoutPanel` | panel placement start/end                            |
| `collapsible`            | trigger icon margin                                  |
| `breadcrumbs`            | separator mirroring                                  |
| `pagination`             | prev/next icon mirroring via `data-mirror`           |

Track in checklist; don't block `Hidden` on full audit completion.

## Architecture

```
DesignSystemProvider
  ├── direction → <html dir> + DirectionContext
  └── existing color mode / theme

hidden recipe
  ├── hiddenClassName({ hide }) → hashed utility with @media display:none
  └── Hidden React wrapper

useDirection() → icon components, Collapsible chevron, carousel controls
```

## Implementation plan

| Step | Work                                                                |
| ---- | ------------------------------------------------------------------- |
| 1    | `DirectionProvider` + `useDirection`; extend `DesignSystemProvider` |
| 2    | `hidden` recipe + `hiddenClassName()` helper with tests             |
| 3    | `Hidden` React component                                            |
| 4    | RTL audit: `sideNav`, `menu`, `layoutPanel` logical properties      |
| 5    | `Icon` `data-mirror` support + docs                                 |
| 6    | Astro: `Hidden` renders children in HTML with hide class (SSR-safe) |

## Open questions

1. **Breakpoint naming** — align with Reshaped `s/m/l/xl` aliases in docs or stay `sm/md/lg/xl` only?
2. **`display: none` vs `hidden` attribute** — `display: none` removes from a11y tree; acceptable for responsive nav duplicates?
3. **Collocate with `DesignSystemProvider`** — single provider vs nested `DirectionProvider`?

## Success criteria

- Docs layout: sidebar `Hidden hide={{ md: true }}` renders on SSR without hydration flash.
- `dir="rtl"` demo: side nav and breadcrumbs mirror correctly.
- No new `useMediaQuery` required for responsive show/hide patterns in docs.
