# Popup lifecycle — state attributes, animation, events

**Date:** 2026-08-21  
**Status:** Proposal  
**Inspired by:** [Base UI Animation](https://base-ui.com/react/handbook/animation.md), [Customization](https://base-ui.com/react/handbook/customization.md), [Styling](https://base-ui.com/react/handbook/styling.md)  
**Related:** [Compound overlay parts](./2026-08-21-compound-overlay-parts-design.md); `LayerProvider`; `themeWhen.reducedMotion`; [base-ui-comparison](../../base-ui-comparison.md)

## Summary

Give every floating overlay a **shared lifecycle contract** so consumers can style and animate from CSS, and so `onOpenChange` can be vetoed by reason. Implement this as a small helper used by Dialog, Popover, Tooltip, HoverCard, Menu, Drawer, and CommandPalette — not as a new headless library.

Stay on React Aria. Mirror Base UI's _attributes and event shape_, not their runtime.

## Problem

| Gap                       | Today                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| **Unmount is instant**    | RAC overlays unmount when closed; CSS cannot play an exit transition                     |
| **Sparse state attrs**    | `data-open` exists on CommandPalette, MobileNav, Layout only                             |
| **No animation protocol** | `prefers-reduced-motion` is honored on spinner/skeleton, not dialogs                     |
| **No positioner vars**    | Consumers cannot `max-height: var(--available-height)`                                   |
| **Boolean-only events**   | `onOpenChange(open: boolean)` — cannot distinguish Escape vs outside click vs trigger    |
| **z-index workaround**    | `LayerProvider` allocates inline `z-index` instead of a stacking-context story           |
| **iOS 26 Safari**         | `position: fixed` backdrops fail to cover the visual viewport; Base UI documents the fix |

## Goals

| Goal                      | Detail                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| **Public `data-*` attrs** | `data-open`, `data-closed`, `data-starting-style`, `data-ending-style` on popup + backdrop       |
| **Exit before unmount**   | Wait for CSS transitions/animations on the popup (and backdrop) before unmounting                |
| **Reduced motion**        | `themeWhen.reducedMotion` / `atReducedMotion` skip duration; unmount immediately                 |
| **Positioner CSS vars**   | `--var-ui-available-height`, `--var-ui-available-width`, `--var-ui-transform-origin`             |
| **Change event details**  | `onOpenChange(open, details)` with `reason` + `cancel()`                                         |
| **Document stacking**     | App root `isolation: isolate`; iOS 26 backdrop recipe; `LayerProvider` remains for theme portals |
| **One helper**            | Shared hook + attribute map so each overlay does not reimplement the protocol                    |

## Non-goals (v1)

- JavaScript animation libraries (Motion) integration beyond “opacity is detectable via `getAnimations()`”
- Replacing `LayerProvider` (still needed when the theme class is not on `documentElement` and the portal targets `body`)
- Drawer swipe / virtual-keyboard scroll
- Changing RAC's own `data-entering` / `data-exiting` if they appear in a future RAC version — **prefer mapping RAC attrs to our public names** rather than fighting them
- A public `mergeProps` / `useRender` package

## Public attribute contract

These attributes are **public API** (same semver rules as class names). Document them on each overlay page.

| Attribute             | Where              | Meaning                                                              |
| --------------------- | ------------------ | -------------------------------------------------------------------- |
| `data-open`           | popup, backdrop    | Present while open (including during exit until unmount)             |
| `data-closed`         | popup, backdrop    | Present during the closing phase (for `@keyframes` exit)             |
| `data-starting-style` | popup, backdrop    | Present for one frame / until open transition finishes               |
| `data-ending-style`   | popup, backdrop    | Present while the close transition runs                              |
| `data-placement`      | popup / positioner | RAC placement string (`top`, `bottom start`, …)                      |
| `data-pressed`        | triggers           | If RAC already exposes it, pass through; do not invent a second name |
| `data-disabled`       | triggers, items    | Pass through from RAC                                                |

For form controls, validity attributes live in the [field spec](./2026-08-21-field-parts-validation-design.md) (`data-invalid`, `data-dirty`, …). Do not overload overlay attrs onto inputs.

### Animation CSS (recipes)

Transitions are the default (cancellable mid-flight), matching Base UI's recommendation:

```ts
// dialog popup slot (illustrative)
{
  transition: `opacity ${t.duration.fast.var} ${t.easing.standard.var},
               transform ${t.duration.fast.var} ${t.easing.standard.var}`,
  transformOrigin: 'var(--var-ui-transform-origin, center)',
  '&[data-starting-style], &[data-ending-style]': {
    opacity: 0,
    transform: 'scale(0.98)',
  },
  ...atReducedMotion({
    transition: 'none',
    transform: 'none',
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 1,
    },
  }),
}
```

Backdrop: opacity only (no scale).

CommandPalette already uses `&[data-open]`. Keep that selector working; add starting/ending attrs alongside, do not remove `data-open`.

## Unmount protocol

Shared helper (name TBD, suggested `useOverlayPresence`):

```ts
type UseOverlayPresenceOptions = {
  isOpen: boolean;
  reducedMotion: boolean;
  /** Elements whose animations must finish before unmount. */
  getAnimatedElements: () => Array<HTMLElement | null>;
};

type UseOverlayPresenceResult = {
  /** Mount the portal/popup when true (stays true through exit). */
  mounted: boolean;
  /** Attributes to spread on popup and backdrop. */
  attrs: {
    'data-open'?: '';
    'data-closed'?: '';
    'data-starting-style'?: '';
    'data-ending-style'?: '';
  };
};
```

Algorithm:

1. `isOpen` true → `mounted = true`, set `data-starting-style`, then rAF/rAF to remove it (Base UI's two-frame start). Also set `data-open`.
2. `isOpen` false → set `data-ending-style` + `data-closed`. If `reducedMotion` or no animations, `mounted = false` immediately.
3. Otherwise `Promise.all(elements.flatMap(el => el.getAnimations().map(a => a.finished)))`, then `mounted = false`.
4. If `isOpen` flips true during exit, cancel the unmount and clear ending attrs (smooth reverse, same as CSS transition cancel).

Wire `isOpen` from RAC (`onOpenChange`) so RAC still owns a11y/focus; we only delay **our** unmount of styled nodes. If RAC unmounts first, the helper must keep the overlay `keepMounted`-style until animations finish — use RAC `UNSTABLE_*` keep-mounted or control `isOpen` display via the helper while leaving RAC open until exit completes.

**Implementation constraint:** Spike against current RAC Modal/Popover. If RAC removes the DOM before `getAnimations()` can run, control visibility with CSS (`visibility` / `display`) while RAC `isOpen` stays true until `finished`, then set RAC closed. Prefer the smallest hook that preserves focus restore.

Document the chosen RAC adapter in the implementation PR. The public attrs must match this spec even if the adapter is “keep RAC open until exit CSS finishes.”

## Positioner CSS variables

On the positioner / popup root (Popover, Tooltip, HoverCard, Menu, Select list):

| Variable                    | Source                                                |
| --------------------------- | ----------------------------------------------------- |
| `--var-ui-available-height` | min(viewport remaining, RAC maxHeight if any)         |
| `--var-ui-available-width`  | remaining inline size                                 |
| `--var-ui-transform-origin` | side opposite placement (`top` → `bottom center`)     |
| `--var-ui-anchor-width`     | trigger `getBoundingClientRect().width` (optional v1) |

Prefix `--var-ui-` to match tokens. Recipes use them; consumers may too (public).

Dialog/Drawer centered overlays set `--var-ui-transform-origin: center`.

If RAC already sets `--trigger-width` or similar, alias into `--var-ui-*` rather than duplicating measurement.

## Change event details

```ts
type OverlayOpenChangeReason =
  | 'trigger-press'
  | 'escape-key'
  | 'outside-press'
  | 'imperative'
  | 'hover'
  | 'focus'
  | 'unknown';

type OverlayChangeEventDetails = {
  reason: OverlayOpenChangeReason;
  event: Event | null;
  cancel: () => void;
  isCanceled: boolean;
};

type OverlayOpenChangeHandler = (open: boolean, details: OverlayChangeEventDetails) => void;
```

RAC's `onOpenChange` is `(isOpen: boolean) => void`. We wrap it:

```ts
function handleOpenChange(next: boolean) {
  const details = createDetails(inferReason());
  onOpenChange?.(next, details);
  if (details.isCanceled) return;
  setOpen(next);
}
```

`inferReason` uses the last DOM event we saw (`keydown` Escape, `pointerdown` outside, trigger `press`). If unknown, `'unknown'`. Do not block shipping if reason is coarse in v1 — `escape-key` vs `outside-press` vs `trigger-press` is the minimum useful set.

`cancel()` prevents the state update **when the overlay is uncontrolled**. Controlled `isOpen` still requires the parent to honor cancel (document: if controlled, `cancel()` is a no-op and the parent must ignore `next`).

v1 does **not** implement Base UI `allowPropagation()` (nested popup Esc). Nested overlays follow RAC's existing dismiss tree.

## Stacking and iOS

### App root isolation

Document in getting-started (and DesignSystemProvider remarks):

```html
<body>
  <div class="root" style="isolation: isolate">{children}</div>
</body>
```

Optional recipe `layout({ isolation: true })` or a one-line note — do not force a wrapper if `applyToDocument` is set; then `isolation` belongs on `html` or `body` (document the tradeoff).

### iOS 26+ Safari backdrop

In `dialog` / `overlay` / `drawer` backdrop slots:

```ts
'@supports (-webkit-touch-callout: none)': {
  position: 'absolute',
},
```

Document `body { position: relative }` (or the themed root) in getting-started. Add the body rule to `@var-ui/core` document globals **only if** it does not break existing sticky/fixed chrome — prefer docs-first; bake into `document-globals` if dogfood on the docs site is clean.

### LayerProvider

Keep. It exists because token CSS variables do not cascade into `document.body` portals. Compound parts should prefer portalling into the themed root (`applyToDocument` or explicit `portalContainer={themeRoot}`). Lifecycle spec does not remove `useLayer`; Dialog parts should still call it unless the overlay is inside an isolated root **and** portalled into the theme node.

## Files (expected)

| Area       | Likely path                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Helper     | `packages/react/src/overlays/useOverlayPresence.ts`                                                                             |
| Events     | `packages/react/src/overlays/changeEvent.ts`                                                                                    |
| Positioner | `packages/react/src/overlays/usePositionerVars.ts`                                                                              |
| Recipes    | `packages/core/src/components/dialog.ts`, `overlay.ts`, `popover.ts`, `tooltip.ts`, `drawer.ts`, `commandPalette.ts`, `menu.ts` |
| Tests      | `packages/react/src/overlays/*.test.ts` + overlay component tests                                                               |
| Docs       | getting-started + new Animation handbook page                                                                                   |

Exact filenames can shift; the export surface is `OverlayChangeEventDetails` + attributes above.

## Tests

- Open Dialog: `data-starting-style` appears then disappears; `data-open` remains
- Close Dialog: `data-ending-style` present until a mocked `getAnimations()` promise resolves, then unmount
- `prefers-reduced-motion: reduce`: unmount on the same close turn (fake timers / matchMedia mock)
- Re-open during exit: ending attrs clear, popup stays mounted
- `onOpenChange` second arg: Escape → `reason === 'escape-key'`; `cancel()` leaves uncontrolled overlay open
- Positioner: popover near viewport bottom sets a numeric `--var-ui-available-height`
- Recipe snapshot includes starting/ending selectors and `@media (prefers-reduced-motion: reduce)`
- iOS `@supports` rule present on backdrop slots

## Docs

- Handbook **Animation**: copy the Base UI mental model (transitions vs keyframes vs JS), with var-ui attribute names
- Handbook **Customization**: `reason` + `cancel()` examples (tooltip stays open on trigger press)
- Getting started: isolation, iOS 26, portal into theme root
- Each overlay props table: list data attributes and CSS variables (not only React props)

## Open questions

1. **RAC keep-mounted:** Confirm whether current `react-aria-components` Modal/Popover can stay mounted while `isOpen` is false. Adapter choice depends on this spike.
2. **Reason granularity:** Hover/focus vs press for Tooltip — implement if cheap via RAC render props; otherwise `unknown` + `trigger-press` is enough for Dialog v1.
3. **Body `position: relative`:** Global vs documented consumer rule — decide after docs-site visual check.
