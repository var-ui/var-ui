# Phase 3 P1 Overlays Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Phase 3 P1 — Toast (hybrid), Tooltip / Popover / HoverCard, AlertDialog, and CommandPalette React wrapper — as four reviewable PR-shaped commit series, per `specs/phase-3-overlays-p1.md`.

**Architecture:** TypeStyles recipes in `@var-ui/core` (`c.vars()`, semantic tones) plus React Aria Components wrappers in `@var-ui/react`. Floating layers use existing `useLayer()`. Toast wraps RAC’s `UNSTABLE_Toast*` / `UNSTABLE_ToastQueue`. Leave Phase 2 WIP untouched.

**Tech Stack:** TypeStyles ^0.8, React 19, react-aria-components ^1.19, vite-plus (`vp`), Vitest via `vp test`, pnpm workspace.

## Global Constraints

- TypeStyles recipes: `styles.component('<kebab>', (c) => {…}, { layer: 'components' })` from `../runtime`; tokens via `designTokens as t` from `../tokens`.
- Themeable colors/sizes go through `c.vars()` — no hard-coded theme colors outside vars/semantic helpers.
- Never rename existing published class names (`dialog`, `command-palette`, etc.).
- Icons only via `IconProvider` / `<Icon>`; tone → icon: info→`info`, success→`success`, warning→`warning`, danger→`error` (same as Banner/Alert).
- react-aria-components first for a11y; hand-rolled DOM only for static chrome.
- Exports: core from `packages/core/src/components/index.ts`; React from `packages/react/src/components/index.ts` + `packages/react/src/index.ts`.
- Tests: `vite-plus/test` (`describe`/`it`/`expect`); core uses `getRegisteredCss()` from `typestyles` (do **not** call `reset()`); React uses `@testing-library/react` + `user-event` under jsdom.
- Validation before finishing a family: `vp check --fix`, `vp test run`, `vp run packages/core#build packages/react#build`.
- Commits: conventional (`feat(core):`, `feat(react):`, `docs:`); leave Phase 2 WIP unstaged.
- Do not edit files under `examples/vite-app/node_modules/`, `packages/*/dist/`, or other `node_modules` trees.

### File map (create / modify)

| Area           | Files                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Toast core     | Create `packages/core/src/components/toast.ts`, `toast.test.ts`; modify `components/index.ts`                                                           |
| Toast react    | Create `packages/react/src/components/Toast.tsx`, `Toast.test.tsx`; modify react `components/index.ts`, `src/index.ts`, `examples/vite-app/src/App.tsx` |
| Floating core  | Create `tooltip.ts`, `popover.ts`, `hoverCard.ts` + tests; modify `components/index.ts`                                                                 |
| Floating react | Create `Tooltip.tsx`, `Popover.tsx`, `HoverCard.tsx` + tests; exports + App demo                                                                        |
| AlertDialog    | Modify `packages/core/src/components/dialog.ts`, `button.ts`; create `AlertDialog.tsx` + tests; optionally extend `Button.tsx` intent; App demo         |
| CommandPalette | Create `CommandPalette.tsx` + tests; exports + App demo                                                                                                 |
| Tracking       | Modify `ROADMAP.md`, optionally link in `specs/component-breadth.md`                                                                                    |

### PR grouping

1. **PR Toast** — Tasks 1–3
2. **PR Floating stack** — Tasks 4–7
3. **PR AlertDialog** — Tasks 8–9
4. **PR CommandPalette** — Tasks 10–11

---

### Task 1: `toast` recipe (core)

**Files:**

- Create: `packages/core/src/components/toast.ts`
- Create: `packages/core/src/components/toast.test.ts`
- Modify: `packages/core/src/components/index.ts` — add `export { toast } from './toast';`

**Interfaces:**

- Consumes: `semanticChannelAssignments`, `subtleBackgroundColor`, `subtleBorderColor` from `./semanticTone`
- Produces: `toast({ tone?, placement? })` → `{ region, item, icon, body, title, description, close }`

- [ ] **Step 1: Write the failing test**

```ts
// packages/core/src/components/toast.test.ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { toast } from './toast';

describe('toast', () => {
  it('registers region/item slots, tone, and placement variants', () => {
    toast({ tone: 'success', placement: 'bottom-end' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-toast-region');
    expect(css).toContain('var-ui-toast-item');
    expect(css).toContain('var-ui-toast-item-tone-success');
    expect(css).toContain('var-ui-toast-region-placement-bottom-end');
    expect(css).toContain('var-ui-toast-close');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vp test run packages/core/src/components/toast.test.ts`  
Expected: FAIL (cannot resolve `./toast` or export missing)

- [ ] **Step 3: Implement the recipe**

````ts
// packages/core/src/components/toast.ts
import { styles } from '../runtime';
import { designTokens as t } from '../tokens';
import {
  semanticChannelAssignments,
  subtleBackgroundColor,
  subtleBorderColor,
} from './semanticTone';

/**
 * Toast viewport + toast item chrome.
 *
 * ```ts
 * const t = toast({ tone: 'success', placement: 'bottom-end' });
 * <div className={t.region}><div className={t.item}>…</div></div>
 * ```
 */
export const toast = styles.component(
  'toast',
  (c) => {
    const v = c.vars({
      semantic: { value: t.color.accent.default, syntax: '<color>', inherits: true },
      solidBg: { value: t.color.accent.default, syntax: '<color>', inherits: false },
      solidFg: { value: t.color.text.onAccent, syntax: '<color>', inherits: false },
      surface: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
      border: { value: `${t.color.border.default}`, syntax: '<color>', inherits: false },
      titleColor: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      descriptionColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
      closeColor: { value: `${t.color.text.secondary}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['region', 'item', 'icon', 'body', 'title', 'description', 'close'],
      base: {
        region: {
          position: 'fixed',
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[2],
          padding: t.space[4],
          pointerEvents: 'none',
          maxWidth: 'min(24rem, calc(100vw - 2rem))',
        },
        item: {
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: t.space[3],
          padding: t.space[3],
          borderRadius: t.radius.md,
          backgroundColor: subtleBackgroundColor(v.semantic.var),
          border: `1px solid ${subtleBorderColor(v.semantic.var)}`,
          boxShadow: t.shadow.md,
          color: t.color.text.primary,
          outline: 'none',
          '&[data-focus-visible]': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '2px',
          },
        },
        icon: {
          flexShrink: 0,
          display: 'inline-flex',
          marginTop: '2px',
          color: v.semantic.var,
        },
        body: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: t.space[1] },
        title: {
          margin: 0,
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.semibold,
          color: v.titleColor.var,
        },
        description: {
          margin: 0,
          fontSize: t.fontSize.sm,
          color: v.descriptionColor.var,
        },
        close: {
          flexShrink: 0,
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          color: v.closeColor.var,
          cursor: 'pointer',
          display: 'inline-flex',
          padding: t.space[1],
          borderRadius: t.radius.sm,
          '&:hover': {
            backgroundColor: t.color.background.subtle,
            color: t.color.text.primary,
          },
          '&:focus-visible': {
            outline: `2px solid ${t.color.border.focus}`,
            outlineOffset: '1px',
          },
        },
      },
      variants: {
        tone: {
          info: { item: semanticChannelAssignments(v, 'accent') },
          success: { item: semanticChannelAssignments(v, 'success') },
          warning: { item: semanticChannelAssignments(v, 'warning') },
          danger: { item: semanticChannelAssignments(v, 'danger') },
        },
        placement: {
          'top-end': { region: { top: 0, right: 0 } },
          'top-start': { region: { top: 0, left: 0 } },
          'bottom-end': { region: { bottom: 0, right: 0 } },
          'bottom-start': { region: { bottom: 0, left: 0 } },
        },
      },
      defaultVariants: { tone: 'info', placement: 'bottom-end' },
    };
  },
  { layer: 'components' },
);
````

Export from `packages/core/src/components/index.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `vp test run packages/core/src/components/toast.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/components/toast.ts packages/core/src/components/toast.test.ts packages/core/src/components/index.ts
git commit -m "feat(core): add toast recipe"
```

---

### Task 2: Toast React primitives + `useToast`

**Files:**

- Create: `packages/react/src/components/Toast.tsx`
- Create: `packages/react/src/components/Toast.test.tsx`
- Modify: `packages/react/src/components/index.ts`
- Modify: `packages/react/src/index.ts`

**Interfaces:**

- Consumes: `toast` recipe; RAC `UNSTABLE_ToastQueue`, `UNSTABLE_ToastRegion`, `UNSTABLE_Toast`, `UNSTABLE_ToastContent`; `useLayer`; `Icon`; `Button`/`AriaButton`
- Produces:
  - `ToastTone = 'info' | 'success' | 'warning' | 'danger'`
  - `ToastContentData = { title: string; description?: string; tone?: ToastTone }`
  - `ToastProps` — presentational item (title, description, tone, onDismiss?, dismissLabel?)
  - `ToastRegionProps` — `{ placement?; queue?; className? }` — if `queue` omitted and no provider queue, renders empty region shell only when used with provider children pattern; **required pattern:** region always bound to a queue (provider default or prop)
  - `ToastProviderProps` — `{ children; placement?; maxVisibleToasts?: number }`
  - `useToast(): { add: (content: ToastContentData & { durationMs?: number }) => string; dismiss: (id: string) => void }`

**Design note:** Hybrid = presentational `<Toast>` used inside RAC region render props, plus `ToastProvider` owning `UNSTABLE_ToastQueue` and mounting `<ToastRegion>`. Declarative without provider: construct a local `UNSTABLE_ToastQueue` and pass it to `<ToastRegion queue={…}>`, calling `queue.add` yourself — no context required. `useToast()` throws outside `ToastProvider`.

- [ ] **Step 1: Write failing tests**

```tsx
// packages/react/src/components/Toast.test.tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Toast, ToastProvider, ToastRegion, useToast } from './Toast';
import { Button } from './Button';

function wrap(ui: React.ReactNode) {
  return render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('Toast presentational', () => {
  it('renders title/description and dismisses', async () => {
    const onDismiss = vi.fn();
    wrap(<Toast tone="success" title="Saved" description="Draft stored." onDismiss={onDismiss} />);
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Draft stored.')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('useToast', () => {
  it('throws outside ToastProvider', () => {
    expect(() => {
      function Boom() {
        useToast();
        return null;
      }
      wrap(<Boom />);
    }).toThrow(/ToastProvider/);
  });

  it('adds and auto-dismisses a toast', async () => {
    vi.useFakeTimers();
    function Trigger() {
      const toast = useToast();
      return (
        <Button onPress={() => toast.add({ tone: 'info', title: 'Hello', durationMs: 1000 })}>
          Notify
        </Button>
      );
    }
    wrap(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Hello')).toBeTruthy();
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.queryByText('Hello')).toBeNull();
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `vp test run packages/react/src/components/Toast.test.tsx`  
Expected: FAIL (module missing)

- [ ] **Step 3: Implement `Toast.tsx`**

Key implementation sketch (fill imports/types completely in the file):

```tsx
import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import {
  Button as AriaButton,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { toast as toastRecipe, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { useLayer } from '../layers/LayerProvider';
import { cx } from './utils';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';
export type ToastContentData = {
  title: string;
  description?: string;
  tone?: ToastTone;
};
export type ToastPlacement = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';

const toneIcon: Record<ToastTone, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

const DEFAULT_DURATION = 4000;
const DEFAULT_MAX = 3;

type ToastContextValue = {
  queue: InstanceType<typeof UNSTABLE_ToastQueue<ToastContentData>>;
  placement: ToastPlacement;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export type ToastProps = {
  tone?: ToastTone;
  title: string;
  description?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

/** Presentational toast chrome — usable with or without the queue. */
export function Toast({
  tone = 'info',
  title,
  description,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
}: ToastProps): JSX.Element {
  const t = toastRecipe({ tone });
  return (
    <div className={cx(t.item, className)} role="status">
      <span className={t.icon}>
        <Icon name={toneIcon[tone]} />
      </span>
      <div className={t.body}>
        <div className={t.title}>{title}</div>
        {description ? <div className={t.description}>{description}</div> : null}
      </div>
      {onDismiss ? (
        <AriaButton className={t.close} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </div>
  );
}

export type ToastRegionProps = {
  queue: InstanceType<typeof UNSTABLE_ToastQueue<ToastContentData>>;
  placement?: ToastPlacement;
  className?: string;
};

export function ToastRegion({
  queue,
  placement = 'bottom-end',
  className,
}: ToastRegionProps): JSX.Element {
  const { style: layerStyle } = useLayer();
  const slots = toastRecipe({ placement });
  return (
    <AriaToastRegion queue={queue} className={cx(slots.region, className)} style={layerStyle}>
      {({ toast: queued }) => (
        <AriaToast
          toast={queued}
          className={toastRecipe({ tone: queued.content.tone ?? 'info' }).item}
        >
          {({ toast: t }) => (
            <>
              <span className={toastRecipe().icon}>
                <Icon name={toneIcon[t.content.tone ?? 'info']} />
              </span>
              <AriaToastContent className={toastRecipe().body}>
                <Text slot="title" className={toastRecipe().title}>
                  {t.content.title}
                </Text>
                {t.content.description ? (
                  <Text slot="description" className={toastRecipe().description}>
                    {t.content.description}
                  </Text>
                ) : null}
              </AriaToastContent>
              <AriaButton
                className={toastRecipe().close}
                aria-label="Dismiss"
                onPress={() => queue.close(t.key)}
              >
                <Icon name="close" size="sm" />
              </AriaButton>
            </>
          )}
        </AriaToast>
      )}
    </AriaToastRegion>
  );
}

export type ToastProviderProps = {
  children: ReactNode;
  placement?: ToastPlacement;
  maxVisibleToasts?: number;
};

export function ToastProvider({
  children,
  placement = 'bottom-end',
  maxVisibleToasts = DEFAULT_MAX,
}: ToastProviderProps): JSX.Element {
  const queue = useMemo(
    () => new UNSTABLE_ToastQueue<ToastContentData>({ maxVisibleToasts }),
    [maxVisibleToasts],
  );
  const value = useMemo(() => ({ queue, placement }), [queue, placement]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastRegion queue={queue} placement={placement} />
    </ToastContext.Provider>
  );
}

export function useToast(): {
  add: (content: ToastContentData & { durationMs?: number }) => string;
  dismiss: (id: string) => void;
} {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    add: ({ durationMs = DEFAULT_DURATION, ...content }) =>
      ctx.queue.add(content, {
        timeout: durationMs === 0 ? undefined : durationMs,
      }),
    dismiss: (id) => ctx.queue.close(id),
  };
}
```

**Implementer notes:**

- Call `toastRecipe({…})` once per render where practical to avoid churn; the sketch above may hoist `const slots = toastRecipe(…)` inside each map callback.
- Confirm RAC render-prop signatures against installed `Toast.d.ts` — adjust if `children` on `UNSTABLE_ToastRegion` expects `ToastList` / function form differently in 1.19.
- Re-export `UNSTABLE_ToastQueue` as `ToastQueue` if apps need declarative queue without provider: `export { UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components'` (or wrap constructor).
- Export all public symbols + types from `components/index.ts` and `src/index.ts`.

- [ ] **Step 4: Run tests — expect PASS**

Run: `vp test run packages/react/src/components/Toast.test.tsx`  
Expected: PASS (adjust fake-timer / click timing if RAC needs `waitFor`)

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/components/Toast.tsx packages/react/src/components/Toast.test.tsx packages/react/src/components/index.ts packages/react/src/index.ts
git commit -m "feat(react): add Toast, ToastProvider, and useToast"
```

---

### Task 3: Toast example-app demo (closes Toast PR)

**Files:**

- Modify: `examples/vite-app/src/App.tsx`

- [ ] **Step 1: Add an Overlays section stub with Toast demo**

Wrap the existing `LayerProvider` children with `ToastProvider` (inside `IconProvider`). Add:

```tsx
function ToastDemo() {
  const toast = useToast();
  return (
    <HStack gap="sm">
      <Button onPress={() => toast.add({ tone: 'success', title: 'Saved' })}>Success toast</Button>
      <Button
        onPress={() =>
          toast.add({
            tone: 'danger',
            title: 'Failed',
            description: 'Could not save.',
            durationMs: 0,
          })
        }
      >
        Persistent danger
      </Button>
    </HStack>
  );
}

function OverlaysSection() {
  return (
    <Section title="Overlays">
      <ToastDemo />
    </Section>
  );
}
```

Mount `<OverlaysSection />` in `App` after Forms or alongside Dialog. Import `ToastProvider`, `useToast` from `@var-ui/react`.

- [ ] **Step 2: Smoke-check in browser** (optional if env allows): `vp run examples/vite-app#dev` — click buttons, confirm toasts appear.

- [ ] **Step 3: Validate + commit**

```bash
vp check --fix
vp test run
git add examples/vite-app/src/App.tsx
git commit -m "docs(example): demo Toast via useToast"
```

---

### Task 4: `tooltip` recipe + React `Tooltip`

**Files:**

- Create: `packages/core/src/components/tooltip.ts`, `tooltip.test.ts`
- Create: `packages/react/src/components/Tooltip.tsx`, `Tooltip.test.tsx`
- Modify: core + react index exports

**Interfaces:**

- Core: `tooltip()` → `{ root }` (vars for bg/fg/border)
- React: `TooltipProps = { content: ReactNode; children: ReactElement; delay?: number; placement?: Placement; portalContainer?: Element }`

- [ ] **Step 1: Failing core test**

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { tooltip } from './tooltip';

describe('tooltip', () => {
  it('registers root styles', () => {
    tooltip();
    expect(getRegisteredCss()).toContain('var-ui-tooltip-root');
  });
});
```

- [ ] **Step 2: Implement core recipe** — compact dark-surface tip:

```ts
export const tooltip = styles.component(
  'tooltip',
  (c) => {
    const v = c.vars({
      background: { value: `${t.color.text.primary}`, syntax: '<color>', inherits: false },
      foreground: { value: `${t.color.background.surface}`, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root'],
      root: {
        backgroundColor: v.background.var,
        color: v.foreground.var,
        fontSize: t.fontSize.sm,
        padding: `${t.space[1]} ${t.space[2]}`,
        borderRadius: t.radius.sm,
        boxShadow: t.shadow.sm,
        maxWidth: '16rem',
        lineHeight: 1.4,
      },
    };
  },
  { layer: 'components' },
);
```

(`text.primary` on light themes reads as near-black tip; acceptable default — themable via var.)

- [ ] **Step 3: Failing react test**

```tsx
it('shows tooltip content on hover', async () => {
  wrap(
    <Tooltip content="More info">
      <Button>Hover me</Button>
    </Tooltip>,
  );
  await userEvent.hover(screen.getByRole('button', { name: 'Hover me' }));
  expect(await screen.findByRole('tooltip')).toHaveTextContent('More info');
});
```

- [ ] **Step 4: Implement React wrapper**

```tsx
import { Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components';
import { tooltip } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';

export function Tooltip({
  content,
  children,
  delay = 500,
  placement = 'top',
  portalContainer,
}: TooltipProps): JSX.Element {
  const { style: layerStyle } = useLayer();
  const tip = tooltip();
  return (
    <TooltipTrigger delay={delay}>
      {children}
      <AriaTooltip
        className={tip.root}
        placement={placement}
        style={layerStyle}
        UNSTABLE_portalContainer={portalContainer}
      >
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
```

- [ ] **Step 5: Tests pass + commit**

```bash
git add packages/core/src/components/tooltip.ts packages/core/src/components/tooltip.test.ts \
  packages/core/src/components/index.ts \
  packages/react/src/components/Tooltip.tsx packages/react/src/components/Tooltip.test.tsx \
  packages/react/src/components/index.ts packages/react/src/index.ts
git commit -m "feat: add Tooltip recipe and React wrapper"
```

---

### Task 5: Standalone `popover` recipe + React `Popover`

**Files:**

- Create: `packages/core/src/components/popover.ts`, `popover.test.ts`
- Create: `packages/react/src/components/Popover.tsx`, `Popover.test.tsx`
- Modify: indexes

**Interfaces:**

- Core slots: `root`, `title`, `content` (do **not** touch Select/menu popover slot classnames)
- React: `PopoverProps = { trigger: ReactElement; title?: ReactNode; children: ReactNode; placement?; isOpen?; onOpenChange?; portalContainer? }`

- [ ] **Step 1: Core test** — expect `var-ui-popover-root`, `var-ui-popover-title`

- [ ] **Step 2: Core recipe** — surface panel matching menu chrome (bg/border/shadow/radius via vars)

- [ ] **Step 3: React test** — click trigger → dialog content visible; Escape closes

- [ ] **Step 4: React implementation**

```tsx
import { Dialog, DialogTrigger, Heading, Popover as AriaPopover } from 'react-aria-components';
import { popover } from '@var-ui/core';
import { useLayer } from '../layers/LayerProvider';

export function Popover({
  trigger,
  title,
  children,
  placement = 'bottom',
  portalContainer,
  ...triggerProps
}: PopoverProps): JSX.Element {
  const p = popover();
  const { style: layerStyle } = useLayer();
  return (
    <DialogTrigger {...triggerProps}>
      {trigger}
      <AriaPopover
        className={p.root}
        placement={placement}
        style={layerStyle}
        UNSTABLE_portalContainer={portalContainer}
      >
        <Dialog className={p.content}>
          {title ? (
            <Heading slot="title" className={p.title}>
              {title}
            </Heading>
          ) : null}
          {children}
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add standalone Popover recipe and React wrapper"
```

---

### Task 6: `hover-card` recipe + React `HoverCard`

**Files:**

- Create: `packages/core/src/components/hoverCard.ts`, `hoverCard.test.ts`
- Create: `packages/react/src/components/HoverCard.tsx`, `HoverCard.test.tsx`
- Modify: indexes

**Interfaces:**

- Core slots: `root`, `title`, `content` (richer padding than tooltip)
- React: `HoverCardProps = { trigger: ReactElement; children: ReactNode; openDelay?; closeDelay?; placement?; portalContainer? }`

**Behavior:** Open on hover/focus with delays; panel may contain links; **not** modal (no focus trap like AlertDialog). Use RAC `DialogTrigger` with `trigger="hover"` if available in 1.19; otherwise control `isOpen` via `onHoverChange` / focus handlers on a `Focusable` trigger + `Popover`.

Check installed types:

```bash
rg -n "trigger\\?:" node_modules/.pnpm/react-aria-components@1.19.0_*/node_modules/react-aria-components/dist/types/src/Dialog.d.ts | head
```

If `DialogTrigger` supports `trigger="hover"`, prefer that. Else implement controlled open state with open/close timers (`openDelay` default 700, `closeDelay` default 300).

- [ ] **Step 1–4:** TDD as previous tasks — hover shows content; moving pointer into card keeps it open; leave closes after delay.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add HoverCard recipe and React wrapper"
```

---

### Task 7: Floating stack example demo (closes Floating PR)

**Files:**

- Modify: `examples/vite-app/src/App.tsx`

- [ ] **Step 1:** Extend `OverlaysSection` with Tooltip / Popover / HoverCard demos side by side.

```tsx
<HStack gap="md">
  <Tooltip content="Keyboard shortcut hint">
    <Button>Tooltip</Button>
  </Tooltip>
  <Popover trigger={<Button>Popover</Button>} title="Details">
    <Text>Interactive content inside a popover.</Text>
  </Popover>
  <HoverCard trigger={<Button>Hover card</Button>}>
    <Text>Richer preview with a link.</Text>
  </HoverCard>
</HStack>
```

- [ ] **Step 2:** `vp check --fix` + `vp test run` + commit

```bash
git commit -m "docs(example): demo Tooltip, Popover, and HoverCard"
```

---

### Task 8: Extend `dialog` + add button `danger` intent

**Files:**

- Modify: `packages/core/src/components/dialog.ts`
- Modify: `packages/core/src/components/button.ts`
- Modify: `packages/react/src/components/Button.tsx` — extend `intent` union with `'danger'`
- Create or extend: `packages/core/src/components/dialog.test.ts` (or add cases next to existing dialog tests if any)
- Create/extend: button tests if present

**Interfaces:**

- `dialog({ role?: 'dialog' | 'alertdialog' })` adds `actions` slot; keeps all existing slots/classes
- `button({ intent: 'danger' })` — danger bg/fg from `t.color.danger`

- [ ] **Step 1: Failing tests**

```ts
dialog({ role: 'alertdialog' });
const css = getRegisteredCss();
expect(css).toContain('var-ui-dialog-actions');
// TypeStyles emits `<scope>-<component>-<slot>-<variant>-<value>` for slot variants
expect(css).toMatch(/var-ui-dialog-\w+-role-alertdialog/);

button({ intent: 'danger' });
expect(getRegisteredCss()).toContain('var-ui-button-intent-danger');
```

- [ ] **Step 2: Extend dialog**

Add to slots: `'actions'`.  
Add styles:

```ts
actions: {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: t.space[2],
  marginTop: t.space[2],
},
```

Add variant axis `role`:

```ts
role: {
  dialog: {},
  alertdialog: {
    // optional: slightly stronger modal border via var; may be empty if chrome is identical
  },
},
defaultVariants: { role: 'dialog' },
```

Do **not** rename `overlay`/`modal`/etc.

- [ ] **Step 3: Add danger button intent**

```ts
danger: {
  [v.border.name]: t.color.danger.default,
  [v.background.name]: t.color.danger.default,
  [v.foreground.name]: t.color.text.onAccent, // or danger.onSolid if token exists — check semantic.ts
  '&:hover': {
    [v.background.name]: t.color.danger.hover ?? t.color.danger.default,
    [v.border.name]: t.color.danger.hover ?? t.color.danger.default,
  },
},
```

Inspect `packages/core/src/tokens/semantic.ts` for available danger channels and mirror `primary` intent structure. Update `ButtonProps.intent` union.

- [ ] **Step 4: Tests pass + commit**

```bash
git commit -m "feat(core): dialog actions slot, alertdialog role, button danger intent"
```

---

### Task 9: `AlertDialog` React + demo (closes AlertDialog PR)

**Files:**

- Create: `packages/react/src/components/AlertDialog.tsx`, `AlertDialog.test.tsx`
- Modify: react indexes + `examples/vite-app/src/App.tsx`

**Interfaces:**

```ts
export type AlertDialogProps = {
  title: string;
  description: ReactNode;
  cancelLabel?: string; // default Cancel
  confirmLabel?: string; // default Confirm
  isDestructive?: boolean;
  onConfirm: () => void;
  triggerLabel?: string; // if set, renders DialogTrigger + Button
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: Element;
};
```

- [ ] **Step 1: Failing tests**

```tsx
it('calls onConfirm on confirm and not on cancel', async () => {
  const onConfirm = vi.fn();
  wrap(
    <AlertDialog
      triggerLabel="Delete"
      title="Delete item?"
      description="This cannot be undone."
      isDestructive
      confirmLabel="Delete"
      onConfirm={onConfirm}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Delete' })); // trigger
  // Focus: cancel should be focused when destructive
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onConfirm).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: 'Delete' })); // reopen trigger
  await userEvent.click(screen.getByRole('button', { name: 'Delete' })); // confirm — use getAllByRole if ambiguous
  expect(onConfirm).toHaveBeenCalled();
});
```

Use distinct `triggerLabel="Open delete"` vs `confirmLabel="Delete"` to avoid role-name collisions.

- [ ] **Step 2: Implement**

Mirror `Dialog.tsx` structure:

- `dialog({ role: 'alertdialog' })`
- `ModalOverlay` + `Modal` + `AriaDialog` with `role="alertdialog"` (RAC Dialog may take `role` prop — set it)
- Header without optional X close **or** keep close as cancel-equivalent calling `close()` only
- `div.actions`: Cancel `Button intent="secondary"` + Confirm `Button intent={isDestructive ? 'danger' : 'primary'}`
- Destructive: `autoFocus` on Cancel (`autoFocus` prop on Button / AriaButton)
- `onConfirm` then `close()`

- [ ] **Step 3: Example demo** — non-destructive + destructive triggers in Overlays section

- [ ] **Step 4: Validate + commit**

```bash
git commit -m "feat(react): add AlertDialog confirmation modal"
```

---

### Task 10: `CommandPalette` React wrapper

**Files:**

- Create: `packages/react/src/components/CommandPalette.tsx`, `CommandPalette.test.tsx`
- Modify: react indexes

**Interfaces:**

```ts
export type CommandPaletteItem = {
  id: string;
  title: string;
  meta?: string;
  keywords?: string[];
};

export type CommandPaletteProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: CommandPaletteItem[];
  onAction: (id: string) => void;
  placeholder?: string; // default 'Search…'
  emptyLabel?: string; // default 'No results'
  hotkey?: boolean; // default true — ⌘K / Ctrl+K
  filter?: (item: CommandPaletteItem, query: string) => boolean;
  portalContainer?: Element;
};
```

Default filter: case-insensitive match of `query` against `title`, `meta`, and `keywords`.

- [ ] **Step 1: Failing tests**

```tsx
it('filters items and invokes onAction on Enter', async () => {
  const onAction = vi.fn();
  wrap(
    <CommandPalette
      isOpen
      onOpenChange={() => {}}
      hotkey={false}
      items={[
        { id: 'a', title: 'Open settings', keywords: ['prefs'] },
        { id: 'b', title: 'Sign out' },
      ]}
      onAction={onAction}
    />,
  );
  await userEvent.type(screen.getByPlaceholderText('Search…'), 'sett');
  expect(screen.getByText('Open settings')).toBeTruthy();
  expect(screen.queryByText('Sign out')).toBeNull();
  await userEvent.keyboard('{Enter}');
  expect(onAction).toHaveBeenCalledWith('a');
});

it('renders empty state when nothing matches', async () => {
  wrap(
    <CommandPalette
      isOpen
      hotkey={false}
      items={[{ id: 'a', title: 'Only' }]}
      onAction={() => {}}
      onOpenChange={() => {}}
    />,
  );
  await userEvent.type(screen.getByPlaceholderText('Search…'), 'zzz');
  expect(screen.getByText('No results')).toBeTruthy();
});
```

- [ ] **Step 2: Implement**

Structure:

1. Optional `useEffect` hotkey listener when `hotkey` — `metaKey|ctrlKey` + `k`, `preventDefault`, toggle open.
2. When open: `ModalOverlay` using `commandPalette({ open: true })` slots — map:
   - root / backdrop / dialog / inputRow / inputIcon / input / results / result / resultLink / resultTitle / resultMeta / empty
3. Prefer RAC pieces: `Dialog` + `Input` + `ListBox` / `ListBoxItem` for keyboard (ArrowUp/Down/Enter). If combobox pattern fits better, `Autocomplete` + `SearchField` + `ListBox` is acceptable — pick one and keep a11y.
4. `<Icon name="search" />` in `inputIcon`.
5. Apply `useLayer()` style on root/overlay; override recipe’s hard-coded z-index via inline style.
6. Escape closes via RAC dialog / `onOpenChange(false)`.
7. Reset query when closed.

Recipe already defines `open` variant — pass `open: isOpen` when computing classes.

- [ ] **Step 3: Tests pass + commit**

```bash
git commit -m "feat(react): add CommandPalette wrapper"
```

---

### Task 11: CommandPalette demo + ROADMAP (closes CommandPalette PR / phase P1 docs)

**Files:**

- Modify: `examples/vite-app/src/App.tsx`
- Modify: `ROADMAP.md` — expand Phase 3 line to note P1 shipping / link this plan + spec

- [ ] **Step 1: Demo**

```tsx
function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open command palette</Button>
      {last ? <Text tone="secondary">Last action: {last}</Text> : null}
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        items={[
          { id: 'theme', title: 'Toggle theme', meta: 'Appearance' },
          { id: 'docs', title: 'Open docs', keywords: ['help'] },
        ]}
        onAction={(id) => {
          setLast(id);
          setOpen(false);
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Update ROADMAP Phase 3 bullet** to mention P1 delivered (Toast, Tooltip/Popover/HoverCard, AlertDialog, CommandPalette) with links to `specs/phase-3-overlays-p1.md` and this plan; leave P2 (Lightbox/Overlay) unchecked.

- [ ] **Step 3: Full validation**

```bash
vp check --fix
vp test run
vp run packages/core#build packages/react#build
```

- [ ] **Step 4: Commit**

```bash
git commit -m "docs: demo CommandPalette and mark Phase 3 P1 on roadmap"
```

---

## Self-review checklist (author)

- [x] Spec coverage: Toast hybrid, floating trio, AlertDialog-on-dialog, CommandPalette wrapper, example demos, P2 deferred
- [x] No TBD/placeholder steps
- [x] Types consistent (`ToastTone`, `ToastContentData`, `CommandPaletteItem`, AlertDialog props)
- [x] Button `danger` intent added because AlertDialog design requires it and Button lacked it
- [x] Phase 2 WIP explicitly left alone

## Execution Handoff

Plan saved to `plans/2026-07-15-phase-3-overlays-p1.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks
2. **Inline Execution** — execute tasks in this session with checkpoints

Which approach?
