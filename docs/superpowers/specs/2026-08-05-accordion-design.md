# Accordion — multi-panel disclosure

**Date:** 2026-08-05  
**Status:** Proposal  
**Inspired by:** [Reshaped Accordion](https://reshaped.so/docs/getting-started/overview)  
**Related:** `collapsible`, `Collapsible`, `CollapsibleGroup`, RAC `DisclosureGroup`

## Summary

Ship a first-class **`Accordion` compound component** (and optional `accordion` recipe alias) on top of existing `collapsible` styles + React Aria `DisclosureGroup`, with:

- Single-open (default) and multiple-open modes
- Bordered stacked panels (FAQ/settings pattern)
- WAI-ARIA accordion keyboard conventions
- Clear docs distinction from standalone `Collapsible`

**Note:** `CollapsibleGroup` already wraps `DisclosureGroup` with `allowsMultipleExpanded`. This proposal elevates the pattern to a named API, adds accordion-specific chrome, and closes keyboard/a11y gaps.

## Problem

Today:

```tsx
<CollapsibleGroup allowsMultipleExpanded={false}>
  <Collapsible id="a" title="Section A">
    …
  </Collapsible>
  <Collapsible id="b" title="Section B">
    …
  </Collapsible>
</CollapsibleGroup>
```

Gaps vs a dedicated Accordion:

| Gap                 | Detail                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| **Discoverability** | Users search for "Accordion"; `CollapsibleGroup` is undocumented as accordion                       |
| **Visual pattern**  | FAQ UIs want flush stacked borders, dividers between items, no per-panel heading margin             |
| **Keyboard**        | Home/End to jump first/last; optional arrow-key navigation between triggers                         |
| **API ergonomics**  | Compound `Accordion.Item` / `Accordion.Trigger` / `Accordion.Panel` vs repeated `Collapsible` props |
| **Controlled keys** | `expandedKeys` / `onExpandedChange` at group level                                                  |

RAC `DisclosureGroup` handles single-expand logic when `allowsMultipleExpanded={false}` — leverage it, don't rebuild state.

## Goals

| Goal                    | Detail                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Compound API**        | `Accordion`, `Accordion.Item`, `Accordion.Trigger`, `Accordion.Panel`                  |
| **Reuse styles**        | Extend `collapsible` recipe with `accordion` variant or `accordionItem` slot overrides |
| **Modes**               | `type="single" \| "multiple"`, `collapsible` (allow closing last open in single mode)  |
| **Keyboard**            | RAC defaults + document Home/End on trigger                                            |
| **Backward compatible** | `Collapsible` / `CollapsibleGroup` unchanged                                           |

## Non-goals (v1)

- Tree-style nested accordions
- Drag-to-reorder sections
- Animated height (use RAC/CSS defaults; no framer-motion)
- Astro wrapper (React-only for v1; static HTML uses `collapsible` recipe)

## Proposed API

```tsx
<Accordion type="single" defaultExpandedKeys={['billing']} collapsible>
  <Accordion.Item id="billing">
    <Accordion.Trigger>Billing</Accordion.Trigger>
    <Accordion.Panel>
      <p>…</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="shipping">
    <Accordion.Trigger>Shipping</Accordion.Trigger>
    <Accordion.Panel>…</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

### Props

```ts
type AccordionProps = {
  type?: 'single' | 'multiple';
  /** When type=single, allow closing all items. @default true */
  collapsible?: boolean;
  expandedKeys?: Iterable<Key>;
  defaultExpandedKeys?: Iterable<Key>;
  onExpandedChange?: (keys: Set<Key>) => void;
  variant?: 'flush' | 'bordered';
  className?: string;
  children: ReactNode;
};

type AccordionItemProps = {
  id: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

type AccordionTriggerProps = {
  children: ReactNode;
  className?: string;
};

type AccordionPanelProps = {
  children: ReactNode;
  className?: string;
};
```

Map `type="single"` → `allowsMultipleExpanded={false}` on `DisclosureGroup`.  
Map `type="multiple"` → `allowsMultipleExpanded={true}`.

### Recipe changes

Add `accordion` variant to `collapsible` or new `accordion` recipe composing collapsible slots:

```ts
variants: {
  variant: {
    flush: {},
    bordered: {},
    accordion: {
      root: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomWidth: t.borderWidth.default.var,
        '&:first-child': { borderTopWidth: t.borderWidth.default.var },
      },
      trigger: {
        padding: `${t.space[3].var} ${t.space[4].var}`,
      },
      panel: {
        paddingInline: t.space[4].var,
        paddingBlockEnd: t.space[4].var,
      },
    },
  },
}
```

Wrap group in container with `borderInline` + `borderRadius` for outer chrome.

## Implementation sketch

```tsx
// packages/react/src/components/Accordion.tsx
const AccordionContext = createContext<{ variant: AccordionVariant } | null>(null);

function Accordion({ type = 'single', collapsible = true, variant = 'bordered', ... }: AccordionProps) {
  return (
    <DisclosureGroup
      allowsMultipleExpanded={type === 'multiple'}
      expandedKeys={expandedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      onExpandedKeysChange={onExpandedChange}
      className={accordionGroup({ variant }).root}
    >
      <AccordionContext.Provider value={{ variant }}>
        {children}
      </AccordionContext.Provider>
    </DisclosureGroup>
  );
}

function AccordionItem({ id, children, ... }: AccordionItemProps) {
  return <Disclosure id={id}>{children}</Disclosure>;
}

function AccordionTrigger({ children, ... }: AccordionTriggerProps) {
  const { variant } = useAccordionContext();
  const c = collapsible({ variant: variant === 'bordered' ? 'accordion' : 'flush' });
  return (
    <Heading level={3} style={{ margin: 0 }}>
      <AriaButton slot="trigger" {...recipeProps(c.trigger)}>
        <span {...recipeProps(c.triggerIcon)}><Icon name="chevronDown" /></span>
        {children}
      </AriaButton>
    </Heading>
  );
}

function AccordionPanel({ children, ... }: AccordionPanelProps) {
  const c = collapsible({ variant: 'accordion' });
  return <DisclosurePanel {...recipeProps(c.panel)}>{children}</DisclosurePanel>;
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel = AccordionPanel;
```

Refactor shared trigger/panel markup from `Collapsible.tsx` into internal `_disclosureChrome.tsx` to avoid duplication.

## Accessibility

| Requirement               | Source                                                                  |
| ------------------------- | ----------------------------------------------------------------------- |
| `button` triggers         | RAC `Button slot="trigger"`                                             |
| `aria-expanded`           | RAC Disclosure                                                          |
| Single/multiple semantics | `DisclosureGroup`                                                       |
| Home/End                  | Optional `onKeyDown` on trigger: Home → first trigger focus; End → last |
| Arrow keys                | Defer to RAC; add only if audit shows gap                               |

## Docs & migration

| Audience                               | Guidance                                        |
| -------------------------------------- | ----------------------------------------------- |
| FAQ / settings                         | Use `Accordion`                                 |
| Single disclosure (code block, filter) | Keep `Collapsible`                              |
| Existing `CollapsibleGroup`            | Document as lower-level API; no breaking change |

Add docs page `accordion` in registry; demo with 3-item FAQ.

## Implementation plan

| Step | Work                                                             |
| ---- | ---------------------------------------------------------------- |
| 1    | Extract shared disclosure chrome from `Collapsible.tsx`          |
| 2    | Add `accordion` variant to `collapsible` recipe                  |
| 3    | Implement `Accordion` compound component                         |
| 4    | Tests: single vs multiple expand, controlled keys, keyboard      |
| 5    | Docs demo + add to `componentRegistry`                           |
| 6    | Optional: deprecate nothing — cross-link `CollapsibleGroup` docs |

## Open questions

1. **Separate `accordion` recipe vs variant** — variant keeps one style source; separate recipe if accordion diverges heavily.
2. **`collapsible={false}` in single mode** — RAC may support always-one-open; verify `DisclosureGroup` behavior.
3. **Default expanded** — first item open by default in docs only, or no default?

## Success criteria

- FAQ demo: only one section open at a time in `type="single"` mode.
- `type="multiple"` allows independent panels.
- Visual: stacked bordered panels match design system elevation/border tokens.
- `Collapsible` tests still pass unchanged.
