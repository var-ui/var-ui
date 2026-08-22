# Popup lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a shared overlay lifecycle (presence attrs, delayed unmount, change-event details, positioner CSS vars, overlay animation recipes) that compound overlay parts can consume without adding `@base-ui/react`.

**Architecture:** Three React helpers in `packages/react/src/overlays/` plus a TypeStyles style helper in `@var-ui/core`. Recipes on dialog/overlay/popover/tooltip/drawer/commandPalette/menu gain starting/ending styles and iOS backdrop rules. CommandPalette is the first production consumer of the presence attrs; Dialog/Popover wiring lands in the compound-parts plan.

**Tech Stack:** React 19, react-aria-components, TypeStyles, Vitest via `vp test`, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-21-popup-lifecycle-design.md`

## Global Constraints

- Do not add `@base-ui/react`.
- Do not replace `LayerProvider`.
- Do not rename existing public class names; add slots/selectors only.
- Public `data-*` attributes and `--var-ui-*` positioner vars are semver-public (same as class names).
- RAC remains the focus manager; this plan only delays unmount and wraps `onOpenChange`.
- Locked RAC adapter: keep RAC `isOpen={presence.mounted}` so the DOM (and `getAnimations()`) exist through exit; drive `presence` from the consumer's requested open state.
- `cancel()` only blocks updates when the overlay is uncontrolled; controlled `isOpen` is a no-op for `cancel()` (parent must ignore `next`).
- v1 reasons that must work: `escape-key`, `outside-press`, `trigger-press`; other reasons may be `unknown`.
- Run `vp test run packages/react` / `vp test run packages/core` after code tasks; `vp check` before the changeset.

## File map

| File                                                | Responsibility                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `packages/react/src/overlays/changeEvent.ts`        | `OverlayChangeEventDetails`, `createOverlayChangeDetails`, `inferOverlayCloseReason` |
| `packages/react/src/overlays/useOverlayPresence.ts` | Mount/unmount + public data attrs                                                    |
| `packages/react/src/overlays/usePositionerVars.ts`  | `--var-ui-available-*` / `--var-ui-transform-origin`                                 |
| `packages/react/src/overlays/index.ts`              | Public re-exports                                                                    |
| `packages/core/src/components/overlayPresence.ts`   | Shared starting/ending CSS for recipes                                               |
| `packages/core/src/components/overlay.ts`           | Backdrop animation + iOS `@supports`                                                 |
| `packages/core/src/components/dialog.ts`            | Overlay/modal presence styles + iOS                                                  |
| `packages/core/src/components/popover.ts`           | Presence + transform-origin                                                          |
| `packages/core/src/components/tooltip.ts`           | Presence + transform-origin                                                          |
| `packages/core/src/components/hoverCard.ts`         | Presence + transform-origin                                                          |
| `packages/core/src/components/drawer.ts`            | Overlay/panel presence + iOS                                                         |
| `packages/core/src/components/menu.ts`              | Popover slot presence                                                                |
| `packages/core/src/components/commandPalette.ts`    | Starting/ending attrs alongside `data-open`                                          |
| `packages/react/src/components/CommandPalette.tsx`  | Spread presence attrs on panel                                                       |
| `docs/content/docs/getting-started.mdx`             | isolation, iOS 26, portal into theme root                                            |

---

### Task 1: Overlay change-event types

**Files:**

- Create: `packages/react/src/overlays/changeEvent.ts`
- Create: `packages/react/src/overlays/changeEvent.test.ts`
- Create: `packages/react/src/overlays/index.ts`

**Interfaces:**

- Produces: `OverlayOpenChangeReason`, `OverlayChangeEventDetails`, `OverlayOpenChangeHandler`, `createOverlayChangeDetails()`, `inferOverlayCloseReason(event)`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vite-plus/test';
import { createOverlayChangeDetails, inferOverlayCloseReason } from './changeEvent';

describe('createOverlayChangeDetails', () => {
  it('starts uncanceled and cancel() flips isCanceled', () => {
    const details = createOverlayChangeDetails({
      reason: 'escape-key',
      event: null,
    });
    expect(details.isCanceled).toBe(false);
    details.cancel();
    expect(details.isCanceled).toBe(true);
  });
});

describe('inferOverlayCloseReason', () => {
  it('maps Escape keydown to escape-key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    expect(inferOverlayCloseReason(event)).toBe('escape-key');
  });

  it('maps pointerdown to outside-press', () => {
    const event = new PointerEvent('pointerdown');
    expect(inferOverlayCloseReason(event)).toBe('outside-press');
  });

  it('maps click/press to trigger-press', () => {
    const event = new MouseEvent('click');
    expect(inferOverlayCloseReason(event)).toBe('trigger-press');
  });

  it('returns unknown for unrelated events', () => {
    expect(inferOverlayCloseReason(null)).toBe('unknown');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/react/src/overlays/changeEvent.test.ts`

Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```ts
export type OverlayOpenChangeReason =
  | 'trigger-press'
  | 'escape-key'
  | 'outside-press'
  | 'imperative'
  | 'hover'
  | 'focus'
  | 'unknown';

export type OverlayChangeEventDetails = {
  reason: OverlayOpenChangeReason;
  event: Event | null;
  cancel: () => void;
  isCanceled: boolean;
};

export type OverlayOpenChangeHandler = (open: boolean, details: OverlayChangeEventDetails) => void;

export function createOverlayChangeDetails(init: {
  reason: OverlayOpenChangeReason;
  event: Event | null;
}): OverlayChangeEventDetails {
  const details: OverlayChangeEventDetails = {
    reason: init.reason,
    event: init.event,
    isCanceled: false,
    cancel() {
      details.isCanceled = true;
    },
  };
  return details;
}

export function inferOverlayCloseReason(event: Event | null): OverlayOpenChangeReason {
  if (!event) return 'unknown';
  if (event.type === 'keydown' && 'key' in event && event.key === 'Escape') {
    return 'escape-key';
  }
  if (event.type === 'pointerdown' || event.type === 'mousedown') {
    return 'outside-press';
  }
  if (event.type === 'click' || event.type === 'press') {
    return 'trigger-press';
  }
  return 'unknown';
}
```

`packages/react/src/overlays/index.ts`:

```ts
export {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  type OverlayChangeEventDetails,
  type OverlayOpenChangeHandler,
  type OverlayOpenChangeReason,
} from './changeEvent';
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `vp test run packages/react/src/overlays/changeEvent.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/overlays/changeEvent.ts packages/react/src/overlays/changeEvent.test.ts packages/react/src/overlays/index.ts
git commit -m "$(cat <<'EOF'
feat(react): add overlay change-event details helper

Give overlays a Base UI-shaped reason + cancel() object to wrap RAC onOpenChange.
EOF
)"
```

---

### Task 2: `useOverlayPresence`

**Files:**

- Create: `packages/react/src/overlays/useOverlayPresence.ts`
- Create: `packages/react/src/overlays/useOverlayPresence.test.ts`
- Modify: `packages/react/src/overlays/index.ts`

**Interfaces:**

- Consumes: none (pure React)
- Produces: `useOverlayPresence({ isOpen, reducedMotion?, getAnimatedElements })` → `{ mounted, attrs }`

Presence attrs (empty string when present, omitted when absent):

```ts
type OverlayPresenceAttrs = {
  'data-open'?: '';
  'data-closed'?: '';
  'data-starting-style'?: '';
  'data-ending-style'?: '';
};
```

Algorithm (locked):

1. `isOpen` true → `mounted = true`, set `data-open` + `data-starting-style`; two `requestAnimationFrame`s later drop `data-starting-style`.
2. `isOpen` false → set `data-ending-style` + `data-closed` (keep `data-open` until unmount). If `reducedMotion` or `getAnimations()` is empty, unmount immediately.
3. Else wait `Promise.all(els.flatMap((el) => el.getAnimations().map((a) => a.finished)))`, then `mounted = false`.
4. If `isOpen` becomes true during exit, clear ending attrs and stay mounted.

Default `reducedMotion` from `window.matchMedia('(prefers-reduced-motion: reduce)').matches` when the option is omitted.

- [ ] **Step 1: Write the failing test**

Use `renderHook` + `act` + a fake element:

```ts
import { describe, expect, it, vi } from 'vite-plus/test';
import { renderHook, act } from '@testing-library/react';
import { useOverlayPresence } from './useOverlayPresence';

function elementWithAnimation(finished: Promise<void>): HTMLElement {
  const el = document.createElement('div');
  el.getAnimations = () => [{ finished, cancel: () => {} }] as unknown as Animation[];
  return el;
}

describe('useOverlayPresence', () => {
  it('mounts with data-open and clears data-starting-style after two frames', async () => {
    const { result } = renderHook(() =>
      useOverlayPresence({ isOpen: true, reducedMotion: true, getAnimatedElements: () => [] }),
    );
    expect(result.current.mounted).toBe(true);
    expect(result.current.attrs['data-open']).toBe('');
  });

  it('stays mounted while exit animations run', async () => {
    let resolve!: () => void;
    const finished = new Promise<void>((r) => {
      resolve = r;
    });
    const el = elementWithAnimation(finished);
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          reducedMotion: false,
          getAnimatedElements: () => [el],
        }),
      { initialProps: { isOpen: true } },
    );
    rerender({ isOpen: false });
    expect(result.current.mounted).toBe(true);
    expect(result.current.attrs['data-ending-style']).toBe('');
    await act(async () => {
      resolve();
      await finished;
    });
    expect(result.current.mounted).toBe(false);
  });

  it('unmounts immediately when reducedMotion is true', () => {
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          reducedMotion: true,
          getAnimatedElements: () => [],
        }),
      { initialProps: { isOpen: true } },
    );
    rerender({ isOpen: false });
    expect(result.current.mounted).toBe(false);
  });

  it('cancels exit when reopened', async () => {
    let resolve!: () => void;
    const finished = new Promise<void>((r) => {
      resolve = r;
    });
    const el = elementWithAnimation(finished);
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useOverlayPresence({
          isOpen,
          reducedMotion: false,
          getAnimatedElements: () => [el],
        }),
      { initialProps: { isOpen: true } },
    );
    rerender({ isOpen: false });
    rerender({ isOpen: true });
    expect(result.current.mounted).toBe(true);
    expect(result.current.attrs['data-ending-style']).toBeUndefined();
    resolve();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/react/src/overlays/useOverlayPresence.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement `useOverlayPresence`**

Keep the implementation in one file. Guard `getAnimations` for jsdom (`el.getAnimations?.() ?? []`). Ignore nulls in `getAnimatedElements()`. Increment a generation counter so a stale `finished` promise cannot unmount after reopen.

- [ ] **Step 4: Run tests to verify they pass**

Run: `vp test run packages/react/src/overlays/useOverlayPresence.test.ts`

Expected: PASS.

- [ ] **Step 5: Export from `overlays/index.ts` and commit**

```bash
git add packages/react/src/overlays/useOverlayPresence.ts packages/react/src/overlays/useOverlayPresence.test.ts packages/react/src/overlays/index.ts
git commit -m "$(cat <<'EOF'
feat(react): add useOverlayPresence for overlay enter/exit attrs

Delay unmount until CSS animations finish and expose data-starting-style / data-ending-style.
EOF
)"
```

---

### Task 3: `usePositionerVars`

**Files:**

- Create: `packages/react/src/overlays/usePositionerVars.ts`
- Create: `packages/react/src/overlays/usePositionerVars.test.ts`
- Modify: `packages/react/src/overlays/index.ts`

**Interfaces:**

- Produces:

```ts
type OverlayPlacement = 'top' | 'bottom' | 'left' | 'right' | string;

type UsePositionerVarsOptions = {
  placement: OverlayPlacement;
  /** Popup/positioner element. */
  popupRef: RefObject<HTMLElement | null>;
  /** Trigger/anchor element. Optional; needed for --var-ui-anchor-width. */
  triggerRef?: RefObject<HTMLElement | null>;
};

type UsePositionerVarsResult = {
  style: {
    '--var-ui-available-height': string;
    '--var-ui-available-width': string;
    '--var-ui-transform-origin': string;
    '--var-ui-anchor-width'?: string;
  };
};
```

`--var-ui-transform-origin` mapping (use the first token of RAC placement, e.g. `bottom start` → `bottom`):

| side   | origin          |
| ------ | --------------- |
| top    | `bottom center` |
| bottom | `top center`    |
| left   | `center right`  |
| right  | `center left`   |

Available height: `window.innerHeight - popup.getBoundingClientRect().top` when side is `bottom`, `popup.getBoundingClientRect().bottom` when side is `top`, otherwise `window.innerHeight`. Clamp to `>= 0` and stringify as `${px}px`.

- [ ] **Step 1: Write the failing test**

Stub `getBoundingClientRect` on a div, `renderHook` with `placement: 'bottom'`, assert `style['--var-ui-transform-origin'] === 'top center'` and `style['--var-ui-available-height']` ends with `px`.

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/react/src/overlays/usePositionerVars.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement** using `useLayoutEffect` + `useState` + `ResizeObserver` on `popupRef` (and `window` resize). If refs are empty, return `transform-origin` from placement only and `0px` sizes.

- [ ] **Step 4: Run tests to verify they pass**

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/overlays/usePositionerVars.ts packages/react/src/overlays/usePositionerVars.test.ts packages/react/src/overlays/index.ts
git commit -m "$(cat <<'EOF'
feat(react): add usePositionerVars for overlay CSS variables

Expose available size and transform-origin so popover recipes can respect the viewport.
EOF
)"
```

---

### Task 4: Recipe presence helper + overlay/dialog/drawer CSS

**Files:**

- Create: `packages/core/src/components/overlayPresence.ts`
- Create: `packages/core/test/components/overlayPresence.test.ts`
- Modify: `packages/core/src/components/overlay.ts`
- Modify: `packages/core/src/components/dialog.ts`
- Modify: `packages/core/src/components/drawer.ts`
- Modify: `packages/core/src/components/index.ts` — `export { overlayPresenceStyles } from './overlayPresence'`
- Modify: `packages/core/test/components/dialog.test.ts` if selectors need asserting

**Interfaces:**

- Produces: `overlayPresenceStyles({ scale?: boolean })` returning a style object to spread into a slot.

Use existing tokens:

- `t.transition.backdrop.var` for backdrops
- `t.transition.panelEnter.var` plus `transform ${t.duration.slow.var} ${t.easing.emphasized.var}` for scaled popups
- `atReducedMotion` from `../theme-conditions`

```ts
import { atReducedMotion } from '../theme-conditions';
import { designTokens as t } from '../tokens';

export function overlayPresenceStyles(options: { scale?: boolean } = {}) {
  const scale = options.scale ?? false;
  return {
    transition: scale
      ? `${t.transition.panelEnter.var}, transform ${t.duration.slow.var} ${t.easing.emphasized.var}`
      : t.transition.backdrop.var,
    transformOrigin: 'var(--var-ui-transform-origin, center)',
    '&[data-starting-style], &[data-ending-style]': {
      opacity: 0,
      ...(scale ? { transform: 'scale(0.98)' } : {}),
    },
    ...atReducedMotion({
      transition: 'none',
      transform: 'none',
      '&[data-starting-style], &[data-ending-style]': {
        opacity: 1,
      },
    }),
  };
}

export const overlayIosAbsoluteBackdrop = {
  '@supports (-webkit-touch-callout: none)': {
    position: 'absolute',
  },
} as const;
```

Spread onto:

- `overlay` `backdrop` (no scale + iOS)
- `dialog` `overlay` (no scale + iOS) and `modal` (`scale: true`, `--var-ui-transform-origin: center` default is fine)
- `drawer` `overlay` (no scale + iOS) and `panel` (`scale: false` — drawers slide; add `transform` only if the recipe already translates; do **not** add scale to drawers)

- [ ] **Step 1: Write a core unit test** that `overlayPresenceStyles({ scale: true })` includes `'&[data-starting-style], &[data-ending-style]'` and that `dialog().overlay` / `dialog().modal` class names are unchanged from current public names (assert `className` still contains `var-ui-dialog__overlay` and `var-ui-dialog__modal` — inspect current snapshot/class strings in a failing test first if needed).

- [ ] **Step 2: Run `vp test run packages/core/test/components/overlayPresence.test.ts packages/core/test/components/dialog.test.ts`** — expect FAIL.

- [ ] **Step 3: Implement helper and spread into recipes.** Do not rename slots.

- [ ] **Step 4: Run core tests.** If CI class snapshot fails, from `packages/core` run `pnpm exec typestyles snapshot --write` **only after confirming no class was removed**.

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(core): add overlay enter/exit styles and iOS 26 backdrop positioning

Share data-starting-style / data-ending-style transitions and absolute backdrops on iOS Safari.
EOF
)"
```

---

### Task 5: Presence styles on popover, tooltip, hoverCard, menu, commandPalette

**Files:**

- Modify: `packages/core/src/components/popover.ts` — spread `overlayPresenceStyles({ scale: true })` on `root`; `maxHeight: 'var(--var-ui-available-height, none)'`
- Modify: `packages/core/src/components/tooltip.ts` — same on `root`
- Modify: `packages/core/src/components/hoverCard.ts` — same on `root`
- Modify: `packages/core/src/components/menu.ts` — same on the popover slot (whatever slot wraps RAC `Popover`; today `popover`)
- Modify: `packages/core/src/components/commandPalette.ts` — keep `&[data-open] { opacity: 1 }`; add starting/ending selectors that set `opacity: 0`, plus `atReducedMotion({ transition: 'none' })` on `dialog`

**Interfaces:**

- Consumes: `overlayPresenceStyles` from Task 4
- Produces: unchanged public class names + new CSS selectors

- [ ] **Step 1: Extend `packages/core/test/components/dialog.test.ts` pattern** — add `popover.test.ts` (or extend an existing popover test if present) asserting `popover().root` is defined and still named `var-ui-popover__root`.

- [ ] **Step 2: Run core tests — expect FAIL only if files missing; otherwise implement first if tests already pass on class names.** Prefer a test that stringifies styles if the package exposes them; otherwise a smoke `expect(popover().root).toBeTruthy()` plus visual recipe compile (existing core tests already import recipes).

- [ ] **Step 3: Implement recipe spreads.**

- [ ] **Step 4: `vp test run packages/core`** — PASS. Snapshot write if the linter requires new class names (should not; selectors only).

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(core): animate popover, tooltip, menu, and command palette overlays

Apply the shared presence contract so floating UI can fade without extra JS in each wrapper.
EOF
)"
```

---

### Task 6: Wire CommandPalette + export overlays from `@var-ui/react`

**Files:**

- Modify: `packages/react/src/components/CommandPalette.tsx` — call `useOverlayPresence({ isOpen: open, getAnimatedElements: () => [panelRef.current] })`, spread `presence.attrs` onto the panel that already has `data-open`. Keep existing `data-open={open ? '' : undefined}` **or** replace it with `presence.attrs` (presence already sets `data-open` while mounted). Prefer spreading `presence.attrs` so starting/ending attrs appear. Attach `ref={panelRef}` on that panel.
- Modify: `packages/react/src/components/CommandPalette.test.tsx` — open the palette and assert the panel has `data-open`. Close it with `reducedMotion` not easily injectable; assert `data-ending-style` is set _or_ that `data-open` is removed after close. If close unmounts immediately (no CSS animations in jsdom), assert unmount — jsdom `getAnimations` is empty so presence unmounts immediately, which is correct.
- Modify: `packages/react/src/index.ts` — export overlay helpers:

```ts
export {
  createOverlayChangeDetails,
  inferOverlayCloseReason,
  useOverlayPresence,
  usePositionerVars,
  type OverlayChangeEventDetails,
  type OverlayOpenChangeHandler,
  type OverlayOpenChangeReason,
} from './overlays';
```

- [ ] **Step 1: Add the CommandPalette assertion** (`data-open` present when open). Run to see current behavior.

- [ ] **Step 2: Implement wiring + public exports.**

- [ ] **Step 3: `vp test run packages/react`** — PASS.

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): export overlay lifecycle helpers and wire CommandPalette attrs

Make presence/positioner/change-event APIs public and dogfood them on CommandPalette.
EOF
)"
```

---

### Task 7: Getting-started docs

**Files:**

- Modify: `docs/content/docs/getting-started.mdx`

Add a section **Portals and stacking** after the provider step:

```md
## Portals and stacking

Wrap the application in an isolating root so portaled dialogs and popovers stack above page `z-index`:

\`\`\`html

<body>
  <div class="root">{children}</div>
</body>
\`\`\`

\`\`\`css
.root {
isolation: isolate;
}
\`\`\`

When `DesignSystemProvider` uses `applyToDocument`, put `isolation: isolate` on `html` or `body` instead of an extra wrapper.

### Themed portals

Token CSS variables cascade from the theme class. If an overlay portals to `document.body` and the theme class is on a subtree, pass `portalContainer` pointing at the themed node (or use `applyToDocument`).

### iOS 26+ Safari backdrops

Dialog and drawer backdrops use `position: absolute` under `@supports (-webkit-touch-callout: none)`. Add `body { position: relative; }` so a scrolled page still covers the visual viewport.
```

Do **not** add handbook pages in this plan (Animation / Customization are comparison Phase 3).

- [ ] **Step 1: Edit getting-started.mdx**

- [ ] **Step 2: `vp check`** (docs tests include navigation; getting-started is already linked)

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: document overlay stacking, themed portals, and iOS 26 backdrops

Consumers need isolation and body positioning for portaled overlays to paint correctly.
EOF
)"
```

---

### Task 8: Changeset + check

**Files:**

- Create: `.changeset/overlay-lifecycle.md`

```md
---
'@var-ui/core': minor
'@var-ui/react': minor
---

Add overlay enter/exit data attributes, positioner CSS variables, and change-event details (`reason` + `cancel()`). Recipes animate dialog, popover, tooltip, drawer, menu, and command palette. CommandPalette spreads the presence attributes. No `@base-ui/react` dependency.
```

- [ ] **Step 1: Add changeset**

- [ ] **Step 2: `vp check` and `vp test run packages/core packages/react`**

Expected: PASS.

- [ ] **Step 3: Commit the changeset**

```bash
git add .changeset/overlay-lifecycle.md
git commit -m "$(cat <<'EOF'
chore: changeset for overlay lifecycle helpers

EOF
)"
```

---

## Spec coverage

| Spec item                                       | Task                                   |
| ----------------------------------------------- | -------------------------------------- |
| `data-open` / `data-closed` / starting / ending | 2, 4, 5, 6                             |
| Exit waits on `getAnimations()`                 | 2                                      |
| Reduced motion unmounts immediately             | 2, 4                                   |
| Positioner CSS vars                             | 3, 5                                   |
| `reason` + `cancel()`                           | 1                                      |
| iOS 26 backdrop                                 | 4                                      |
| isolation + portal docs                         | 7                                      |
| CommandPalette keeps `data-open`                | 5, 6                                   |
| LayerProvider unchanged                         | (constraint)                           |
| Dialog/Popover consumers                        | **next plan** (compound overlay parts) |
