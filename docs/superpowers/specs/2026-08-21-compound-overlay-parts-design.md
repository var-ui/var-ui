# Compound overlay parts

**Date:** 2026-08-21  
**Status:** Proposal  
**Inspired by:** [Base UI Composition](https://base-ui.com/react/handbook/composition.md), [Dialog](https://base-ui.com/react/components/dialog.md)  
**Related:** Accordion (in-repo template), Combobox, Layout; [popup lifecycle](./2026-08-21-popup-lifecycle-design.md); [base-ui-comparison](../../base-ui-comparison.md)

## Summary

Open Dialog, AlertDialog, Popover, Tooltip, HoverCard, Menu, and Drawer as **compound parts** on top of React Aria Components, matching the Accordion pattern already in `@var-ui/react`. Keep today's assembled signatures as named **presets** so the 80% case stays one component.

Do **not** add `@base-ui/react`. Parts wrap RAC. Recipes stay in `@var-ui/core`.

## Problem

Today:

```tsx
<Dialog triggerLabel="Open" title="Notifications" description="You are all caught up." />
```

| Gap                    | Detail                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Fixed chrome**       | Cannot omit close, add a footer, or put custom body without forking                              |
| **Trigger lock-in**    | Dialog always renders a secondary `Button` labeled `triggerLabel`                                |
| **No composition**     | Cannot nest Tooltip on a Dialog trigger (Base UI does this via nested `render`)                  |
| **Portal + theme**     | `portalContainer` is a bolted-on escape hatch instead of an explicit `Portal` part               |
| **Inconsistent depth** | Accordion / Combobox / Layout are compound; overlays are assembled                               |
| **Menu is data-only**  | `DropdownMenu` takes `sections[]` — custom item rows, links, or submenus require a new component |

Accordion already shows the target shape:

```tsx
<Accordion type="single">
  <Accordion.Item id="billing">
    <Accordion.Trigger>Billing</Accordion.Trigger>
    <Accordion.Panel>…</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

## Goals

| Goal                      | Detail                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Compound is canonical** | `Dialog.Root`, `Dialog.Trigger`, `Dialog.Backdrop`, `Dialog.Popup`, `Dialog.Title`, `Dialog.Close`                                                     |
| **Presets stay**          | Today's Dialog / AlertDialog / Popover / Tooltip / HoverCard / DropdownMenu APIs keep working under `Simple*` or current names as convenience wrappers |
| **RAC underneath**        | Map parts onto existing RAC nodes; no new focus manager                                                                                                |
| **Recipes gain slots**    | `dialog`, `popover`, `tooltip`, `hoverCard`, `menu`, `drawer` expose every public part                                                                 |
| **Trigger is a child**    | Consumer supplies the trigger node (Button, IconButton, Link, custom)                                                                                  |
| **Astro**                 | Static markup uses the same public class names; interaction remains React-only                                                                         |

## Non-goals (v1)

- Adding `@base-ui/react` or a `render` / `asChild` primitive (CopyButton already has a render prop; generalize later)
- Drawer swipe-to-dismiss / snap points (Base UI-specific; high cost)
- Select compound parts (follow-up)
- Changing Accordion / Combobox / Layout (already compound)
- Breaking public recipe class names (add slots; do not rename `var-ui-dialog-*`)

## Mapping to React Aria

| var-ui part          | RAC node                                                    |
| -------------------- | ----------------------------------------------------------- |
| `Dialog.Root`        | `DialogTrigger` (or controlled `ModalOverlay`)              |
| `Dialog.Trigger`     | Child pressable; default `Button` if omitted in preset only |
| `Dialog.Backdrop`    | `ModalOverlay`                                              |
| `Dialog.Popup`       | `Modal` + `Dialog`                                          |
| `Dialog.Title`       | `Heading slot="title"`                                      |
| `Dialog.Description` | description slot / `<p>`                                    |
| `Dialog.Close`       | `Button` calling RAC `close`                                |
| `Popover.Root`       | `DialogTrigger`                                             |
| `Popover.Popup`      | `Popover` + `Dialog`                                        |
| `Tooltip.Root`       | `TooltipTrigger`                                            |
| `Tooltip.Popup`      | `Tooltip`                                                   |
| `Menu.Root`          | `MenuTrigger`                                               |
| `Menu.Popup`         | `Popover` + `Menu`                                          |
| `Menu.Item`          | `MenuItem`                                                  |
| `Drawer.Root`        | controlled `ModalOverlay` (Drawer is usually controlled)    |
| `Drawer.Panel`       | `Modal` + `Dialog`                                          |

`UNSTABLE_portalContainer` stays on Backdrop / Popup until RAC stabilizes the prop. Compound APIs still accept `portalContainer` on the portal-owning part.

## Proposed API

### Dialog (canonical)

```tsx
<Dialog.Root>
  <Dialog.Trigger>
    <Button intent="secondary">Notifications</Button>
  </Dialog.Trigger>
  <Dialog.Backdrop>
    <Dialog.Popup>
      <Dialog.Header>
        <Dialog.Title>Notifications</Dialog.Title>
        <Dialog.Close aria-label="Close" />
      </Dialog.Header>
      <Dialog.Description>You are all caught up.</Dialog.Description>
      <Dialog.Actions>
        <Dialog.Close render={<Button>Close</Button>} />
      </Dialog.Actions>
    </Dialog.Popup>
  </Dialog.Backdrop>
</Dialog.Root>
```

v1 may skip a generic `render` on Close and instead:

```tsx
<Dialog.Close>
  <Button>Close</Button>
</Dialog.Close>
```

`Dialog.Close` clones/forwards `onPress` onto a single child (the Accordion-trigger pattern: one child, we own behavior). If `children` is omitted, render the existing icon close button.

### Types

```ts
type OverlayOpenChangeHandler = (open: boolean, details: OverlayChangeEventDetails) => void;
// OverlayChangeEventDetails is defined in the popup-lifecycle spec.

type DialogRootProps = {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: OverlayOpenChangeHandler;
  /** RAC: isDismissable on the overlay. @default true */
  isDismissable?: boolean;
  portalContainer?: Element;
};

type DialogTriggerProps = {
  children: ReactElement;
  className?: string;
};

type DialogBackdropProps = {
  children: ReactNode;
  className?: string;
  isDismissable?: boolean;
};

type DialogPopupProps = {
  children: ReactNode;
  className?: string;
};

type DialogTitleProps = { children: ReactNode; className?: string };
type DialogDescriptionProps = { children: ReactNode; className?: string };
type DialogCloseProps = {
  children?: ReactElement;
  'aria-label'?: string;
  className?: string;
};
```

Export both:

```ts
export const Dialog: {
  (props: DialogRootProps): JSX.Element; // Dialog === Dialog.Root
  Root: typeof DialogRoot;
  Trigger: typeof DialogTrigger;
  Backdrop: typeof DialogBackdrop;
  Popup: typeof DialogPopup;
  Header: typeof DialogHeader;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Actions: typeof DialogActions;
  Close: typeof DialogClose;
};
```

`Dialog(props)` is **Root**, not today's assembled component. That is a breaking change at `0.x`.

### Preset (today's API)

```ts
/** Assembled dialog — previous default export. */
export function SimpleDialog(props: {
  triggerLabel: string;
  title: string;
  description: ReactNode;
  closeLabel?: string;
  portalContainer?: Element;
}): JSX.Element;
```

`SimpleDialog` is implemented as the compound tree. Re-export `SimpleDialog as Dialog` is **not** allowed after this change — docs and demos switch to compound; a changelog alias `SimpleDialog` covers old call sites.

AlertDialog: keep the current confirm API as `AlertDialog` (it is already a preset: title, description, cancel/confirm). Add `AlertDialog.Root` / `Trigger` / `Backdrop` / `Popup` / `Title` / `Actions` for custom chrome. `AlertDialog` without parts (today's props) remains the preset.

### Popover

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

New recipe slots: `arrow` on `popover` (and `tooltip` if we draw a caret). Arrow can be v1.1 if it blocks; ship a slot even if the default is a CSS triangle.

Today's `Popover({ trigger, title, children, placement })` becomes `SimplePopover`.

### Tooltip / HoverCard

Same split: `Root` / `Trigger` / `Popup`. Tooltip `Popup` children are the content (today's `content` prop). HoverCard keeps richer content inside `Popup`.

```tsx
<Tooltip.Root delay={500}>
  <Tooltip.Trigger>
    <IconButton label="Info" />
  </Tooltip.Trigger>
  <Tooltip.Popup placement="top">More about this field</Tooltip.Popup>
</Tooltip.Root>
```

### Menu

Canonical compound (new):

```tsx
<Menu.Root>
  <Menu.Trigger>
    <Button>Song</Button>
  </Menu.Trigger>
  <Menu.Popup>
    <Menu.Item id="lib" onAction={…}>Add to Library</Menu.Item>
    <Menu.Item id="playlist" onAction={…}>Add to Playlist</Menu.Item>
    <Menu.Separator />
    <Menu.Section title="Danger">
      <Menu.Item id="delete" onAction={…}>Delete</Menu.Item>
    </Menu.Section>
  </Menu.Popup>
</Menu.Root>
```

Keep `DropdownMenu` + `MenuContent({ sections })` as the data preset. `Menu` is a new export; do not silently change `DropdownMenu`.

### Drawer

Drawer is usually controlled (`isOpen` / `onOpenChange`). Compound:

```tsx
<Drawer.Root isOpen={open} onOpenChange={setOpen} placement="end">
  <Drawer.Backdrop>
    <Drawer.Panel>
      <Drawer.Header>
        <Drawer.Title>Settings</Drawer.Title>
        <Drawer.Close />
      </Drawer.Header>
      <Drawer.Body>{children}</Drawer.Body>
    </Drawer.Panel>
  </Drawer.Backdrop>
</Drawer.Root>
```

Keep today's `Drawer({ title, children, isOpen, … })` as the preset by implementing it with parts internally (no rename required — Drawer already looks like a panel API). Add named parts on `Drawer` like Accordion.

## Recipe changes

| Recipe      | Add slots                                                                                                              | Keep existing                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `dialog`    | already has overlay/modal/content/header/heading/…                                                                     | Map part names to those slots; do not rename classes |
| `popover`   | `arrow`, `positioner` (wrapper for RAC Popover)                                                                        | `root`, `title`, `content`                           |
| `tooltip`   | `arrow` optional                                                                                                       | `root`                                               |
| `hoverCard` | same as popover                                                                                                        | existing                                             |
| `menu`      | already item/section/separator                                                                                         | used by both DropdownMenu and Menu parts             |
| `drawer`    | header/body/close already exist                                                                                        | attach to `Drawer.*`                                 |
| `overlay`   | shared backdrop/positioner — Dialog.Backdrop should compose `overlay()` instead of duplicating fixed-inset in `dialog` |                                                      |

Public class names: **add only**. Snapshot update is expected.

## Trigger child contract

Trigger parts accept **one React element** and merge RAC trigger props onto it (ref, `onPress`/`onClick`, `aria-expanded`, `aria-haspopup`). The child must forward ref and spread DOM props — document this in the Composition handbook page.

If the child is a var-ui `Button` / `IconButton` / `Link`, this already works because they spread RAC props.

Do not use Base UI `render={<MyButton />}` in v1. One-child merge is enough and matches Tooltip today (`children: ReactElement`).

## Migration

| Old                                         | New                                   |
| ------------------------------------------- | ------------------------------------- |
| `<Dialog triggerLabel title description />` | `<SimpleDialog … />` or compound tree |
| `<Popover trigger={btn} title>`             | `<SimplePopover>` or `Popover.Root`   |
| `<Tooltip content children>`                | `<SimpleTooltip>` or `Tooltip.Root`   |
| `<DropdownMenu sections>`                   | unchanged                             |
| `<Drawer isOpen title>`                     | unchanged preset; parts available     |
| `<AlertDialog title onConfirm>`             | unchanged preset; parts available     |

Docs demos: Dialog / Popover / Tooltip switch to compound as the **default** demo; presets get a second demo titled “Simple”.

`0.x` breaking change is acceptable. Changelog must list `Dialog` default export now being Root.

## Tests

- Compound Dialog: custom trigger, no close button, description omitted, controlled `isOpen`
- Nested Tooltip trigger wrapping Dialog.Trigger (press + hover) — if RAC cannot nest, document the limitation rather than inventing `render`
- SimpleDialog still opens/closes and labels the close button
- AlertDialog confirm still does not fire on Escape
- Menu.Item `onAction` + DropdownMenu `sections` both work
- Recipe snapshot: new slots present, old class names unchanged
- Portal: `portalContainer` on Backdrop still receives the overlay (theme class case)

## Docs

- Component pages: default demo is compound; preset demo second
- New handbook page **Composition** (can land with Phase 3 docs): trigger child contract, nesting, presets vs parts
- Update `docs/content/components/dialog.mdx` accessibility note: still RAC; parts are how you assemble chrome

## Open questions

1. **Default export name:** `Dialog === Root` (breaking, recommended) vs keep `Dialog` as SimpleDialog and export parts as `Dialog.Root` on a namespace object that is also callable as the preset (too magical).
2. **Tooltip-on-Dialog-trigger:** RAC may require wrapping in a focusable that both triggers attach to. Spike in the first implementation PR; if nesting fails, ship parts without that demo.
3. **`Dialog.Header` / `Actions`:** layout-only divs with recipe slots vs letting consumers use `HStack`. Prefer recipe slots so SimpleDialog and custom trees share chrome.
