# Compound overlay parts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Dialog, AlertDialog, Popover, Tooltip, HoverCard, Menu, and Drawer compound components on React Aria, with presets for today's assembled APIs.

**Architecture:** Follow Accordion: `Dialog` is Root and also `Dialog.Root` / `Trigger` / `Backdrop` / `Popup` / `Title` / `Close`. RAC nodes stay underneath. `useOverlayPresence` + `createOverlayChangeDetails` from the lifecycle plan wrap open state. Today's Dialog/Popover/Tooltip signatures move to `SimpleDialog` / `SimplePopover` / `SimpleTooltip`. `AlertDialog`, `DropdownMenu`, and `Drawer` keep their current call signatures as presets and gain `.Root` parts.

**Tech Stack:** React 19, react-aria-components, `@var-ui/core` recipes, Vitest, Testing Library, user-event.

**Spec:** `docs/superpowers/specs/2026-08-21-compound-overlay-parts-design.md`  
**Depends on:** `docs/superpowers/plans/2026-08-21-popup-lifecycle.md` (helpers must already be exported from `@var-ui/react`)

## Global Constraints

- Do not add `@base-ui/react`. No `render` prop in v1 (one child on Trigger/Close).
- Do not rename public recipe class names; add slots only (`popover` may add `arrow`).
- `Dialog` default export **becomes Root** (breaking at 0.x). `Field` is unrelated.
- Re-export `SimpleDialog as Dialog` is forbidden.
- `DropdownMenu` + `MenuContent({ sections })` stay; `Menu` is a new compound export.
- `AlertDialog` without parts (title / onConfirm / triggerLabel) stays the default export.
- `Drawer({ isOpen, title, children })` stays the default export; parts are added on the same function like Accordion.
- Nested Tooltip-on-Dialog-Trigger: spike in Task 2; if RAC cannot nest, skip that demo and document in dialog.mdx. Do not invent `render`.
- `UNSTABLE_portalContainer` stays on the portal-owning part (`Backdrop` / `Popup`).
- Run `vp test run packages/react` after each component task; `vp check` before the changeset.

## File map

| File | Responsibility |
| --- | --- |
| `packages/react/src/overlays/mergeOverlayChild.ts` | Clone one child with RAC/close props |
| `packages/react/src/overlays/OverlayCloseContext.ts` | `close()` from RAC Dialog render prop |
| `packages/react/src/components/Dialog.tsx` | Compound Dialog |
| `packages/react/src/components/SimpleDialog.tsx` | Previous Dialog API |
| `packages/react/src/components/AlertDialog.tsx` | Preset + parts |
| `packages/react/src/components/Popover.tsx` | Compound + SimplePopover |
| `packages/react/src/components/Tooltip.tsx` | Compound + SimpleTooltip |
| `packages/react/src/components/HoverCard.tsx` | Compound + SimpleHoverCard (optional name: keep `HoverCard` as preset) |
| `packages/react/src/components/Menu.tsx` | New compound Menu |
| `packages/react/src/components/Drawer.tsx` | Preset implemented with parts |
| `packages/react/src/index.ts` | Exports |
| `packages/core/src/components/popover.ts` | Add `arrow` slot (CSS triangle OK) |
| Docs demos / mdx listed per task | Compound as default demo |

---

### Task 1: `mergeOverlayChild` + close context

**Files:**

- Create: `packages/react/src/overlays/mergeOverlayChild.ts`
- Create: `packages/react/src/overlays/mergeOverlayChild.test.tsx`
- Create: `packages/react/src/overlays/OverlayCloseContext.ts`
- Modify: `packages/react/src/overlays/index.ts`

**Interfaces:**

- Produces:

```ts
function mergeOverlayChild(
  child: ReactElement,
  props: Record<string, unknown> & { ref?: Ref<unknown> },
): ReactElement;
```

Merges `className` via `cx`, composes `onPress`/`onClick`/`onKeyDown` (child first, then ours), and uses `composeRefs` if both refs exist. If `child` is not a valid element, throw.

```ts
export const OverlayCloseContext = createContext<(() => void) | null>(null);
export function useOverlayClose(): () => void;
```

`useOverlayClose` throws `'Dialog.Close must be rendered inside Dialog.Popup'` when null.

- [ ] **Step 1: Write tests**

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mergeOverlayChild } from './mergeOverlayChild';

describe('mergeOverlayChild', () => {
  it('forwards onClick onto a single child', async () => {
    const parent = vi.fn();
    const child = vi.fn();
    const merged = mergeOverlayChild(
      <button type="button" onClick={child}>Go</button>,
      { onClick: parent },
    );
    render(merged);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(child).toHaveBeenCalled();
    expect(parent).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

`vp test run packages/react/src/overlays/mergeOverlayChild.test.tsx`

- [ ] **Step 3: Implement with `cloneElement` + `cx` from `typestyles`.** For refs, assign a callback ref that sets both.

- [ ] **Step 4: Tests PASS**

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add overlay child merge helper and close context

Compound triggers and close buttons need to forward RAC props onto a single consumer child.
EOF
)"
```

---

### Task 2: Compound `Dialog` + `SimpleDialog`

**Files:**

- Modify: `packages/react/src/components/Dialog.tsx` (replace assembled implementation)
- Create: `packages/react/src/components/SimpleDialog.tsx`
- Modify: `packages/react/src/components/Dialog.test.tsx`
- Modify: `packages/react/src/components/index.ts` — export `SimpleDialog`, types
- Modify: `packages/react/src/index.ts` if it does not re-export from `./components` already (it does)

**Interfaces:**

- Consumes: `useOverlayPresence`, `createOverlayChangeDetails`, `inferOverlayCloseReason`, `mergeOverlayChild`, `OverlayCloseContext`
- Produces: `Dialog` (Root) + static parts; `SimpleDialog`

Locked RAC adapter: Root holds `requestedOpen`. `presence = useOverlayPresence({ isOpen: requestedOpen, getAnimatedElements: () => [backdropRef.current, popupRef.current] })`. RAC `DialogTrigger` / `ModalOverlay` get `isOpen={presence.mounted}` and `onOpenChange` wrapped:

```ts
const handleOpenChange = (next: boolean) => {
  const details = createOverlayChangeDetails({
    reason: inferOverlayCloseReason(lastEventRef.current),
    event: lastEventRef.current,
  });
  onOpenChange?.(next, details);
  if (details.isCanceled) return;
  if (isOpen === undefined) setRequestedOpen(next);
};
```

Capture last event with `onKeyDownCapture` / overlay `onClick` on Backdrop (document in a 5-line comment if the capture lives on Root).

Parts:

| Part | Renders |
| --- | --- |
| `Dialog` / `Dialog.Root` | `DialogTrigger` + presence context |
| `Dialog.Trigger` | `mergeOverlayChild(children, racTriggerProps)` — if RAC injects props onto Trigger as first child, `Dialog.Trigger` must `forwardRef` and merge onto **its** child |
| `Dialog.Backdrop` | `ModalOverlay` with `recipeProps(dialog().overlay)`, `presence.attrs`, `ref={backdropRef}`, `UNSTABLE_portalContainer`, `style={useLayer().style}` |
| `Dialog.Popup` | `Modal` + `AriaDialog`; provide `OverlayCloseContext` with RAC `close`; spread `presence.attrs` on modal; `ref={popupRef}` |
| `Dialog.Header` | `div` + `dialog().header` |
| `Dialog.Title` | `Heading slot="title"` + `heading` |
| `Dialog.Description` | `p` + `description` |
| `Dialog.Actions` | `div` + `actions` |
| `Dialog.Close` | default icon `Button` **or** `mergeOverlayChild(children, { onPress: close })` |

`SimpleDialog` is the old `Dialog` body using parts:

```tsx
<Dialog.Root portalContainer={portalContainer}>
  <Dialog.Trigger>
    <Button intent="secondary">{triggerLabel}</Button>
  </Dialog.Trigger>
  <Dialog.Backdrop>
    <Dialog.Popup>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Close aria-label={closeLabel} />
      </Dialog.Header>
      <Dialog.Description>{description}</Dialog.Description>
      <Dialog.Actions>
        <Dialog.Close>
          <Button>{closeLabel}</Button>
        </Dialog.Close>
      </Dialog.Actions>
    </Dialog.Popup>
  </Dialog.Backdrop>
</Dialog.Root>
```

- [ ] **Step 1: Rewrite `Dialog.test.tsx`**

Keep portal + open tests but import `SimpleDialog` for the old API. Add compound tests:

```tsx
it('opens from a custom trigger and allows omitting Close', async () => {
  render(
    <IconProvider icons={{}}>
      <LayerProvider>
        <Dialog.Root>
          <Dialog.Trigger>
            <button type="button">Custom</button>
          </Dialog.Trigger>
          <Dialog.Backdrop>
            <Dialog.Popup>
              <Dialog.Title>Only title</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Backdrop>
        </Dialog.Root>
      </LayerProvider>
    </IconProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Custom' }));
  expect(screen.getByText('Only title')).toBeTruthy();
  expect(screen.queryByLabelText('Close')).toBeNull();
});

it('supports controlled isOpen', async () => {
  function Controlled() {
    const [open, setOpen] = useState(true);
    return (
      <IconProvider icons={{}}>
        <LayerProvider>
          <Dialog.Root isOpen={open} onOpenChange={(next) => setOpen(next)}>
            <Dialog.Backdrop>
              <Dialog.Popup>
                <Dialog.Title>Pinned</Dialog.Title>
              </Dialog.Popup>
            </Dialog.Backdrop>
          </Dialog.Root>
        </LayerProvider>
      </IconProvider>
    );
  }
  render(<Controlled />);
  expect(screen.getByText('Pinned')).toBeTruthy();
});
```

Move the existing `triggerLabel` tests to `SimpleDialog.test.tsx` (or the same file under `describe('SimpleDialog')`).

- [ ] **Step 2: Run tests — expect FAIL** (`Dialog.Root` missing; old `triggerLabel` broken).

- [ ] **Step 3: Implement Dialog + SimpleDialog.** Attach parts:

```ts
export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Actions: DialogActions,
  Close: DialogClose,
});
```

Spike Tooltip nesting: wrap `Dialog.Trigger` in `Tooltip.Root`/`Tooltip.Trigger` in a throwaway test. If it fails, delete that test and add one sentence under Accessibility in `dialog.mdx` in Task 9.

- [ ] **Step 4: `vp test run packages/react/src/components/Dialog.test.tsx`** PASS.

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): make Dialog a compound overlay with SimpleDialog preset

Root/Trigger/Backdrop/Popup are the canonical API; the old triggerLabel signature moves to SimpleDialog.
EOF
)"
```

---

### Task 3: AlertDialog parts (preset stays)

**Files:**

- Modify: `packages/react/src/components/AlertDialog.tsx`
- Modify: `packages/react/src/components/AlertDialog.test.tsx`

**Interfaces:**

- Consumes: Dialog parts **or** duplicated RAC alertdialog tree with `dialog({ role: 'alertdialog' })`. Prefer composing Dialog parts with `role` passed through Popup/Root. If Dialog.Popup cannot set `role="alertdialog"`, add `Dialog.Popup` prop `role?: 'dialog' | 'alertdialog'` in this task (small additive change to Task 2).

Keep `AlertDialog(props)` as today's function. Assign:

```ts
AlertDialog.Root = Dialog.Root; // only if role can be alertdialog
```

Safer: implement `AlertDialog.Root/Trigger/Backdrop/Popup/Title/Actions` as thin wrappers that force `role="alertdialog"` on the RAC Dialog. Preset internally uses those parts.

Existing tests must still pass (`onConfirm` not on Escape, destructive autofocus Cancel, controlled without trigger).

Add one compound test: custom trigger + custom confirm button via `AlertDialog.Trigger` / actions children if parts exist; otherwise skip extra test and only refactor internals.

- [ ] **Step 1: Run existing AlertDialog tests** (baseline green).

- [ ] **Step 2: Refactor preset to parts; keep the same props.**

- [ ] **Step 3: Existing tests still PASS. `onOpenChange` may now be `(open, details) => void`. Update the controlled test: `onOpenChange` was `vi.fn()` expecting `(false)` — **change the assertion to** `expect(onOpenChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: expect.any(String) }))` while remaining compatible if the preset still calls with one argument. Spec wants two args. Update `AlertDialogProps.onOpenChange` to `OverlayOpenChangeHandler`.

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): rebuild AlertDialog on compound overlay parts

Keep the confirm preset and pass change-event details through onOpenChange.
EOF
)"
```

---

### Task 4: Compound Popover + `SimplePopover`

**Files:**

- Modify: `packages/core/src/components/popover.ts` — add slot `arrow` (CSS triangle: `width/height` 8px, `background` inherit, rotate). Keep `root`, `title`, `content`.
- Modify: `packages/react/src/components/Popover.tsx`
- Create: `packages/react/src/components/SimplePopover.tsx` if keeping files split; or export `SimplePopover` from `Popover.tsx`
- Modify: `packages/react/src/components/Popover.test.tsx` (create if missing)
- Modify: `packages/react/src/components/index.ts`

**Interfaces:**

```tsx
<Popover.Root>
  <Popover.Trigger>
    <Button>Filters</Button>
  </Popover.Trigger>
  <Popover.Popup placement="bottom" portalContainer={el}>
    <Popover.Arrow />
    <Popover.Title>Filters</Popover.Title>
    <Popover.Content>{children}</Popover.Content>
  </Popover.Popup>
</Popover.Root>
```

RAC: `DialogTrigger` + `Popover` + `Dialog`. Spread `useOverlayPresence` attrs on the RAC Popover. Spread `usePositionerVars({ placement, popupRef, triggerRef }).style` merged with `useLayer().style`.

`SimplePopover` = today's `Popover({ trigger, title, children, placement, portalContainer })`.

- [ ] **Step 1: Tests** — custom trigger opens panel; `SimplePopover` still opens from `trigger={}`; Arrow renders a node with the arrow class (`var-ui-popover__arrow`).

- [ ] **Step 2: FAIL then implement.** Update TypeStyles snapshot if a new class name appears (`pnpm exec typestyles snapshot --write` in `packages/core`).

- [ ] **Step 3: `vp test run packages/react/src/components/Popover.test.tsx packages/core`** PASS.

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: add compound Popover parts and SimplePopover preset

Consumers can assemble chrome; the trigger/title props API remains as SimplePopover.
EOF
)"
```

---

### Task 5: Compound Tooltip + HoverCard

**Files:**

- Modify: `packages/react/src/components/Tooltip.tsx`
- Modify: `packages/react/src/components/HoverCard.tsx`
- Tests: `Tooltip.test.tsx` (create/update), `HoverCard.test.tsx` (create/update)

**Interfaces:**

Tooltip:

```tsx
<Tooltip.Root delay={500}>
  <Tooltip.Trigger>
    <button type="button">Info</button>
  </Tooltip.Trigger>
  <Tooltip.Popup placement="top">More about this field</Tooltip.Popup>
</Tooltip.Root>
```

`SimpleTooltip` = today's `{ content, children, delay, placement, portalContainer }`.

HoverCard: **keep `HoverCard` as the preset** (`trigger`, `title`, `children`, delays) per spec (“Drawer-like”). Add `HoverCard.Root` / `Trigger` / `Popup` / `Title` / `Content` on the same function. Internals use presence + positioner vars. Preserve cloneElement delay behavior **or** switch delays to RAC Popover if already equivalent — do not regress openDelay/closeDelay.

- [ ] **Step 1: Tests** — Tooltip shows content on hover/focus (use `userEvent.hover` + fake timers if the delay is 500ms; set `delay={0}` in tests). SimpleTooltip still accepts `content`. HoverCard existing tests must pass (if none, add: hover trigger shows title).

- [ ] **Step 2: Implement.**

- [ ] **Step 3: PASS + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): compound Tooltip and HoverCard overlay parts

SimpleTooltip preserves the content/children API; HoverCard stays a preset with optional parts.
EOF
)"
```

---

### Task 6: Compound `Menu` (DropdownMenu unchanged)

**Files:**

- Create: `packages/react/src/components/Menu.tsx`
- Create: `packages/react/src/components/Menu.test.tsx`
- Modify: `packages/react/src/components/index.ts`
- Modify: `packages/react/src/components/DropdownMenu.test.tsx` — run to guarantee no break

**Interfaces:**

```tsx
<Menu.Root>
  <Menu.Trigger>
    <Button>Song</Button>
  </Menu.Trigger>
  <Menu.Popup>
    <Menu.Item id="lib" onAction={fn}>Add to Library</Menu.Item>
    <Menu.Separator />
    <Menu.Section title="Danger">
      <Menu.Item id="delete" onAction={fn}>Delete</Menu.Item>
    </Menu.Section>
  </Menu.Popup>
</Menu.Root>
```

RAC: `MenuTrigger` + `Popover` + `Menu` + `MenuItem` + `Header` + `Separator`. Reuse `menu()` recipe slots (`item`, `sectionHeader`, `separator`, `popover`, `menu`). Presence attrs on the popover.

Do **not** change `DropdownMenu`. Optionally implement `DropdownMenu` via `Menu.*` internally if that is a small refactor; not required.

- [ ] **Step 1: Test** `onAction` on an item; DropdownMenu `sections` test still passes.

- [ ] **Step 2: Implement + export `Menu`.**

- [ ] **Step 3: PASS + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): add compound Menu alongside DropdownMenu

Custom item trees get Menu.Item parts; the sections[] preset is unchanged.
EOF
)"
```

---

### Task 7: Drawer parts on the existing preset

**Files:**

- Modify: `packages/react/src/components/Drawer.tsx`
- Modify: `packages/react/src/components/Drawer.test.tsx`

**Interfaces:**

`Drawer` remains `(props: DrawerProps) => JSX.Element` with today's props. Attach:

`Drawer.Root`, `Drawer.Backdrop`, `Drawer.Panel`, `Drawer.Header`, `Drawer.Title`, `Drawer.Close`, `Drawer.Body`

Implement the preset by rendering those parts. Wire `useOverlayPresence` so close animates. `onOpenChange` becomes `OverlayOpenChangeHandler` — update tests that expect a single boolean to also accept details (`toHaveBeenCalledWith(false, expect.anything())` or `mock.calls[0][0] === false`).

No swipe gestures.

- [ ] **Step 1: Run existing Drawer tests; update assertions for two-arg `onOpenChange`.**

- [ ] **Step 2: Refactor to parts + presence.**

- [ ] **Step 3: Add a compound test: `Drawer.Root` without title still labels via `aria-label`.**

- [ ] **Step 4: PASS + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(react): expose Drawer compound parts and overlay presence

The existing isOpen/title preset stays; custom chrome can assemble Header/Body/Close.
EOF
)"
```

---

### Task 8: Docs demos + component pages

**Files:**

- Modify: `docs/src/demos/dialog/default/react.tsx` — compound Dialog (React-only). Add `dialog.default` to `docs/src/demos/reactOnlyDemoIds.ts` if it is not already React-only; **or** keep html/astro as static chrome of the open state (current html.ts). Prefer: default React demo uses compound API; html/astro remain static recipe previews.
- Create: `docs/src/demos/dialog/simple/react.tsx` — `SimpleDialog`
- Register `dialog.simple` in `docs/src/demos/types.ts` (`DemoId` union), `registry.ts` (`DEMO_IDS`, snippets, loaders, `demoRegistry`), `reactDemoMap.ts`, `reactOnlyDemoIds.ts`
- Modify: `docs/content/components/dialog.mdx` — default demo compound; second demo Simple; note `Dialog` is Root; trigger child must forward DOM props
- Modify: `docs/src/demos/popover/default/react.tsx` + `popover.simple` similarly
- Modify: `docs/content/components/popover.mdx`, `tooltip.mdx`, `hover-card.mdx`, `drawer.mdx`, `alert-dialog.mdx`
- Modify: `docs/src/data/components.ts` — Dialog import line can mention `SimpleDialog`; add Menu if there is no page yet. If no `menu.mdx`, add `docs/content/components/menu.mdx` (one default demo) **and** a `components.ts` entry. DropdownMenu page stays.
- Copy the demo registration pattern from `alert-dialog.confirm` (already in registry).

Run `vp test run docs` (or `vp test run docs/src/demos/completeness.test.ts`) so every `Demo id=` has a registry entry.

- [ ] **Step 1: Update dialog default demo to compound parts; add Simple demo + mdx.**

- [ ] **Step 2: Repeat popover/tooltip; light touch on hover-card/drawer/alert-dialog (note parts in mdx even if default demo stays preset).**

- [ ] **Step 3: Completeness tests PASS.**

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: show compound overlay APIs as the default Dialog and Popover demos

Keep Simple* presets as a second demo so the 80% case stays copy-pasteable.
EOF
)"
```

---

### Task 9: Changeset + check

**Files:**

- Create: `.changeset/compound-overlays.md`

```md
---
'@var-ui/core': minor
'@var-ui/react': minor
---

**Breaking:** `Dialog` is now the compound Root (`Dialog.Trigger` / `Backdrop` / `Popup`). Use `SimpleDialog` for the old `triggerLabel` / `title` / `description` API.

Popover and Tooltip follow the same split (`SimplePopover`, `SimpleTooltip`). HoverCard, AlertDialog, and Drawer keep their preset signatures and gain compound parts. New `Menu` compound API; `DropdownMenu` is unchanged.
```

- [ ] **Step 1: Changeset**

- [ ] **Step 2: `vp check` && `vp test run packages/react packages/core docs`**

- [ ] **Step 3: Commit changeset**

---

## Spec coverage

| Spec item | Task |
| --- | --- |
| Dialog compound + SimpleDialog | 2, 8 |
| AlertDialog preset + parts | 3 |
| Popover + Arrow slot | 4 |
| Tooltip / HoverCard | 5 |
| Menu compound; DropdownMenu stays | 6 |
| Drawer parts; preset stays | 7 |
| Trigger one-child merge | 1, 2 |
| No `render` prop | constraint |
| Recipe class names additive | 4 |
| Portal container | 2, 4 |
| Docs default = compound | 8 |
| Tooltip nested on Dialog trigger | spike in 2 |
