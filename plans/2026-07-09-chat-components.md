# Chat Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship var-ui's "MVP + AI streaming essentials" Chat suite — `ChatLayout`, `ChatMessageList`, `ChatMessage`, `ChatMessageBubble`, `ChatComposer`/`ChatComposerInput`, `ChatSendButton`, `ChatToolCalls`, `ChatSystemMessage`, `ChatMessageMetadata` — plus the `useChatStreamScroll`/`useChatNewMessages` hooks, as its own initiative ahead of the Phase 2–6 ordering in `specs/component-breadth.md`.

**Architecture:** Every visual component is a TypeStyles recipe in `@var-ui/core` (`styles.component()` with `c.vars()` for themeable properties) plus a React wrapper in `@var-ui/react` built on react-aria-components where interactive. Chat is the first component "vertical" large enough to warrant its own `components/chat/` subfolder in both packages, rather than the flat one-file-per-component layout used everywhere else. `ChatMessageBubble` does zero markdown parsing — it takes `children: ReactNode` and consumers wire their own renderer (e.g. `react-markdown` with a `code` override rendering the existing `CodeBlock`).

**Tech Stack:** TypeStyles (`styles.component()`), React 19, react-aria-components (`TextField`/`TextArea`, existing `Button`), vite-plus (`vp`) toolchain, Vitest via `vp test` (jsdom + `@testing-library/react` already configured), pnpm workspace.

**Reference implementation (read-only, do not modify):** `~/dev/astryx/packages/core/src/Chat/*` — Meta's Astryx design system's real Chat suite. Useful for behavior cross-checks, but var-ui's scope and API are deliberately slimmer per `specs/chat-components.md`.

**Design doc:** `specs/chat-components.md` — read it first for the full rationale; this plan implements it task-by-task, with a few implementation refinements called out inline (simplified `chatLayout` dock — no frosted-glass blur layer; simplified `useChatStreamScroll` — native smooth-scroll instead of a hand-rolled rAF spring; `chatMessageBubble` grouped corners tighten symmetrically rather than per-sender, avoiding a compound variant grid).

## Global Constraints

Copied from `specs/chat-components.md` + repo conventions — every task implicitly includes these:

- **TypeStyles, not raw CSS**: recipes use `styles.component('<kebab-name>', (c) => {…}, { layer: 'components' })`, importing `styles` from `../../runtime` and `designTokens as t` from `../../tokens` (one extra `../` versus flat recipes, since chat recipes live in `components/chat/`).
- **V3 contract**: every themeable color goes through `c.vars({ name: { value, syntax, inherits } })`. Tone colors come from `../semanticTone` (`semanticTone`, `subtleBackgroundColor`, `semanticChannelAssignments`, `badgeTonePaint`).
- **Stable semantic class names are public API**: `styles.component('chat-message-bubble', …)` produces classes like `var-ui-chat-message-bubble-root[-sender-user]`. Never rename an existing class once this ships.
- **No compound variant grids**: where Astryx's reference implementation needs a sender × group compound (e.g. bubble corner tightening), var-ui simplifies to independent single-axis variants per the codebase's stated preference (see `alert.ts`'s doc comment). This is a deliberate, documented scope reduction — not a bug.
- **react-aria-components first** for the composer's text input (`TextField`/`TextArea`); hand-rolled DOM only for static/presentational parts (bubble, system message, tool call rows).
- **Icons resolve only through `IconProvider`** — components call `<Icon name="…" />` from `../../icons`; never import `@var-ui/icons` directly from a component.
- **`ChatMessageBubble` takes `children: ReactNode`** — no markdown parsing in `@var-ui/core` or `@var-ui/react`.
- **Exports**: every recipe exported from `packages/core/src/components/chat/index.ts` then re-exported via `export * from './chat';` in `packages/core/src/components/index.ts`; every React component + prop type exported the same way through `packages/react/src/components/chat/index.ts` → `packages/react/src/components/index.ts` → `packages/react/src/index.ts`.
- **Test conventions**: core recipe tests import `getRegisteredCss` from `typestyles` and assert on registered class-name substrings (see `packages/core/src/components/feedback.test.ts`). React tests use `@testing-library/react` (`render`, `screen`) + `@testing-library/user-event`, importing `describe`/`it`/`expect`/`vi` from `vite-plus/test`. Any test rendering a component that uses `<Icon>` must wrap it in `<IconProvider icons={{}}>` (see `Banner.test.tsx`) — an empty registry is enough since tests assert on structure/ARIA, not glyphs.
- **Validation commands**: `vp check --fix` (format + lint + typecheck), `vp test run` (all test projects), `vp run packages/core#build packages/react#build packages/icons#build` before finishing.
- **Commits**: one per task, conventional style (`feat(core): …`, `feat(react): …`, `feat(icons): …`), ending with:
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`

### Existing-pattern cheat sheet (read once, reuse everywhere)

- Slot recipe + tone variant via `semanticTone.ts`: `packages/core/src/components/banner.ts`.
- Flat recipe + tone variant: `packages/core/src/components/badge.ts`.
- React wrapper composing a slot recipe + `<Icon>` + RAC `Button`: `packages/react/src/components/Banner.tsx`.
- React wrapper test wrapping in `<IconProvider>`: `packages/react/src/components/Banner.test.tsx`.
- Reusable layout primitive: `packages/react/src/components/Stack.tsx` (`HStack`/`VStack`).
- `cx` helper: `import { cx } from '../utils';` (one more `../` than flat components, since chat React files live in `components/chat/`).

---

### Task 1: Chat icon glyphs (`arrowUp`, `stop`, `wrench`, `clock`)

**Files:**

- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/icons/iconNames.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/icons/iconNames.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/icons/src/bundle2.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/icons/src/bundle2.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/icons/src/index.ts`

**Interfaces:**

- Produces: `IconName` widened to include `'arrowUp' | 'stop' | 'wrench' | 'clock'`; `bundle2Icons: Partial<Record<IconName, ReactNode>>` covering those 4 names; `defaultIcons` merges bundle 1 + bundle 2. Tasks 8 (`ChatSendButton` needs `arrowUp`/`stop`) and 7 (`ChatToolCalls` needs `wrench`/`clock`) depend on these exact names existing on `IconName`.

- [ ] **Step 1: Write the failing core test**

Replace the body of `packages/core/src/icons/iconNames.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { icon } from '../components/icon';
import { iconNameList } from './iconNames';

describe('icon system (core)', () => {
  it('ships bundle 1 + chat bundle 2 semantic names', () => {
    expect([...iconNameList].sort()).toEqual(
      [
        'check',
        'chevronDown',
        'chevronLeft',
        'chevronRight',
        'close',
        'copy',
        'error',
        'info',
        'search',
        'success',
        'warning',
        'arrowUp',
        'stop',
        'wrench',
        'clock',
      ].sort(),
    );
  });

  it('registers size variants and color var', () => {
    icon({ size: 'md' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-icon-base');
    expect(css).toContain('var-ui-icon-size-md');
    expect(css).toMatch(/--var-ui-icon-[\w-]*color/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL — `iconNameList` doesn't yet contain the 4 new names.

- [ ] **Step 3: Widen `IconName`**

In `packages/core/src/icons/iconNames.ts`, change the array to:

```ts
export const iconNameList = [
  'close',
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'check',
  'copy',
  'search',
  'info',
  'success',
  'warning',
  'error',
  'arrowUp',
  'stop',
  'wrench',
  'clock',
] as const;

export type IconName = (typeof iconNameList)[number];
```

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Write the failing icons-package test**

`packages/icons/src/bundle2.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { isValidElement } from 'react';
import { bundle2Icons } from './bundle2';
import { defaultIcons } from './index';

const BUNDLE_2_NAMES = ['arrowUp', 'stop', 'wrench', 'clock'] as const;

describe('@var-ui/icons bundle 2 (chat)', () => {
  it('maps every bundle-2 name to a React element', () => {
    for (const name of BUNDLE_2_NAMES) {
      expect(isValidElement(bundle2Icons[name]), `missing glyph: ${name}`).toBe(true);
    }
  });

  it('defaultIcons includes bundle 2', () => {
    expect(Object.keys(defaultIcons)).toEqual(expect.arrayContaining([...BUNDLE_2_NAMES]));
  });
});
```

- [ ] **Step 6: Run to verify it fails**

Run: `vp test run`
Expected: FAIL — `./bundle2` doesn't exist yet.

- [ ] **Step 7: Implement the glyphs**

`packages/icons/src/bundle2.tsx` — same hand-authored style as `bundle1.tsx` (24×24 viewBox, `currentColor` stroke):

```tsx
import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * Bundle 2 — chat-specific glyphs (send/stop, tool calls, pending status).
 * Hand-authored inline SVGs (24×24, `currentColor`), no icon-library dependency.
 */
export const bundle2Icons: Partial<Record<IconName, ReactNode>> = {
  arrowUp: (
    <Glyph>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </Glyph>
  ),
  stop: (
    <Glyph>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
    </Glyph>
  ),
  wrench: (
    <Glyph>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.65 2.65-2-2z" />
    </Glyph>
  ),
  clock: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Glyph>
  ),
};
```

`packages/icons/src/index.ts` — merge bundle 2 into `defaultIcons`:

```ts
import type { ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { bundle1Icons } from './bundle1';
import { bundle2Icons } from './bundle2';

export { bundle1Icons };
export { bundle2Icons };

/** All shipped bundles merged — pass to `IconProvider` for var-ui defaults. */
export const defaultIcons: Partial<Record<IconName, ReactNode>> = {
  ...bundle1Icons,
  ...bundle2Icons,
};
```

- [ ] **Step 8: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add packages/core/src/icons packages/icons/src
git commit -m "$(cat <<'EOF'
feat(core,icons): add chat icon glyphs (arrowUp, stop, wrench, clock)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Chat context (sender/density)

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatContext.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatContext.test.tsx`

**Interfaces:**

- Produces (consumed by Tasks 3, 4, 5):

```ts
type ChatSender = 'user' | 'assistant';
type ChatDensity = 'compact' | 'balanced' | 'spacious';
type ChatListContextValue = { density: ChatDensity };
const ChatListContext: React.Context<ChatListContextValue | null>;
function useChatListContext(): ChatListContextValue | null;
type ChatMessageContextValue = { sender: ChatSender; density: ChatDensity };
const ChatMessageContext: React.Context<ChatMessageContextValue | null>;
function useChatMessageContext(): ChatMessageContextValue | null;
```

- [ ] **Step 1: Write the failing test**

`packages/react/src/components/chat/ChatContext.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import {
  ChatListContext,
  ChatMessageContext,
  useChatListContext,
  useChatMessageContext,
} from './ChatContext';

function ListConsumer() {
  const ctx = useChatListContext();
  return <span>{ctx ? ctx.density : 'none'}</span>;
}

function MessageConsumer() {
  const ctx = useChatMessageContext();
  return <span>{ctx ? `${ctx.sender}-${ctx.density}` : 'none'}</span>;
}

describe('ChatContext', () => {
  it('returns null outside a provider', () => {
    render(<ListConsumer />);
    expect(screen.getByText('none')).toBeTruthy();
  });

  it('reads density from ChatListContext', () => {
    render(
      <ChatListContext.Provider value={{ density: 'compact' }}>
        <ListConsumer />
      </ChatListContext.Provider>,
    );
    expect(screen.getByText('compact')).toBeTruthy();
  });

  it('reads sender and density from ChatMessageContext', () => {
    render(
      <ChatMessageContext.Provider value={{ sender: 'user', density: 'spacious' }}>
        <MessageConsumer />
      </ChatMessageContext.Provider>,
    );
    expect(screen.getByText('user-spacious')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL — `./ChatContext` doesn't exist.

- [ ] **Step 3: Implement**

`packages/react/src/components/chat/ChatContext.tsx`:

```tsx
import { createContext, useContext } from 'react';

export type ChatSender = 'user' | 'assistant';
export type ChatDensity = 'compact' | 'balanced' | 'spacious';

export type ChatListContextValue = { density: ChatDensity };

export const ChatListContext = createContext<ChatListContextValue | null>(null);

/** Density set by an ancestor `ChatMessageList`, or `null` outside one. */
export function useChatListContext(): ChatListContextValue | null {
  return useContext(ChatListContext);
}

export type ChatMessageContextValue = { sender: ChatSender; density: ChatDensity };

export const ChatMessageContext = createContext<ChatMessageContextValue | null>(null);

/** Sender + density set by an ancestor `ChatMessage`, or `null` outside one. */
export function useChatMessageContext(): ChatMessageContextValue | null {
  return useContext(ChatMessageContext);
}
```

- [ ] **Step 4: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(react): add chat sender/density context

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `chatMessageBubble` recipe + `ChatMessageBubble`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatMessageBubble.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatMessageBubble.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessageBubble.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessageBubble.test.tsx`

**Interfaces:**

- Consumes: `ChatMessageContext`, `useChatMessageContext` from Task 2.
- Produces (consumed by Task 4's usage example and the example app in Task 15):

```ts
function chatMessageBubble(props: {
  sender?: 'user' | 'assistant';
  variant?: 'filled' | 'ghost';
  group?: 'none' | 'first' | 'middle' | 'last';
}): { root: string };
type ChatMessageBubbleProps = {
  children: ReactNode;
  variant?: 'filled' | 'ghost';
  group?: 'first' | 'middle' | 'last';
  className?: string;
};
function ChatMessageBubble(props: ChatMessageBubbleProps): JSX.Element;
```

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/chat/chatMessageBubble.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessageBubble } from './chatMessageBubble';

describe('chatMessageBubble', () => {
  it('registers sender, variant, and group variants', () => {
    chatMessageBubble({ sender: 'user', variant: 'ghost', group: 'first' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-message-bubble-root');
    expect(css).toContain('var-ui-chat-message-bubble-root-sender-user');
    expect(css).toContain('var-ui-chat-message-bubble-root-variant-ghost');
    expect(css).toContain('var-ui-chat-message-bubble-root-group-first');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the recipe**

`packages/core/src/components/chat/chatMessageBubble.ts`:

````ts
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * The chat "bubble." Sender drives background/text color via `c.vars()` so
 * themes can override user vs. assistant independently.
 *
 * Grouped corners (`group`) tighten symmetrically (top and/or bottom
 * uniformly) for consecutive same-sender bubbles — a deliberate
 * simplification vs. a sender-aware compound grid, avoiding a
 * `sender × group` variant matrix. Revisit only if per-side corner
 * tightening becomes a real visual requirement.
 *
 * ```tsx
 * <div className={chatMessageBubble({ sender: 'user' }).root}>Hi!</div>
 * ```
 */
export const chatMessageBubble = styles.component(
  'chat-message-bubble',
  (c) => {
    const v = c.vars({
      senderBackground: {
        value: t.color.background.subtle,
        syntax: '<color>',
        inherits: false,
      },
      senderText: {
        value: t.color.text.primary,
        syntax: '<color>',
        inherits: false,
      },
    });
    return {
      slots: ['root'],
      base: {
        root: {
          display: 'inline-flex',
          flexDirection: 'column',
          maxWidth: 'min(80%, 480px)',
          padding: `${t.space[3]} ${t.space[4]}`,
          borderRadius: t.radius.lg,
          backgroundColor: v.senderBackground.var,
          color: v.senderText.var,
          fontSize: t.fontSize.md,
          lineHeight: 1.55,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        },
      },
      variants: {
        sender: {
          user: {
            root: {
              [v.senderBackground.name]: t.color.accent.default,
              [v.senderText.name]: t.color.text.onAccent,
            },
          },
          assistant: {
            root: {
              [v.senderBackground.name]: t.color.background.subtle,
              [v.senderText.name]: t.color.text.primary,
            },
          },
        },
        variant: {
          filled: {},
          ghost: {
            root: {
              backgroundColor: 'transparent',
              color: t.color.text.primary,
              padding: `${t.space[1]} 0`,
            },
          },
        },
        group: {
          none: {},
          first: {
            root: {
              borderBottomLeftRadius: t.radius.sm,
              borderBottomRightRadius: t.radius.sm,
            },
          },
          middle: {
            root: {
              borderTopLeftRadius: t.radius.sm,
              borderTopRightRadius: t.radius.sm,
              borderBottomLeftRadius: t.radius.sm,
              borderBottomRightRadius: t.radius.sm,
            },
          },
          last: {
            root: {
              borderTopLeftRadius: t.radius.sm,
              borderTopRightRadius: t.radius.sm,
            },
          },
        },
      },
      defaultVariants: { sender: 'assistant', variant: 'filled', group: 'none' },
    };
  },
  { layer: 'components' },
);
````

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from core barrels**

Create `packages/core/src/components/chat/index.ts`:

```ts
export { chatMessageBubble } from './chatMessageBubble';
```

In `packages/core/src/components/index.ts`, add:

```ts
export * from './chat';
```

- [ ] **Step 6: Write the failing React test**

`packages/react/src/components/chat/ChatMessageBubble.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessageContext } from './ChatContext';
import { ChatMessageBubble } from './ChatMessageBubble';

describe('ChatMessageBubble', () => {
  it('renders children', () => {
    render(<ChatMessageBubble>Hello there</ChatMessageBubble>);
    expect(screen.getByText('Hello there')).toBeTruthy();
  });

  it('applies the sender class from context', () => {
    const { container } = render(
      <ChatMessageContext.Provider value={{ sender: 'user', density: 'balanced' }}>
        <ChatMessageBubble>Hi</ChatMessageBubble>
      </ChatMessageContext.Provider>,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-message-bubble-root-sender-user',
    );
  });

  it('defaults to assistant sender outside context', () => {
    const { container } = render(<ChatMessageBubble>Hi</ChatMessageBubble>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-message-bubble-root-sender-assistant',
    );
  });

  it('maps group to the "none" default when omitted', () => {
    const { container } = render(<ChatMessageBubble>Hi</ChatMessageBubble>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-message-bubble-root-group-none',
    );
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `vp test run`
Expected: FAIL — `./ChatMessageBubble` doesn't exist.

- [ ] **Step 8: Implement**

`packages/react/src/components/chat/ChatMessageBubble.tsx`:

````tsx
import type { JSX, ReactNode } from 'react';
import { chatMessageBubble } from '@var-ui/core';
import { cx } from '../utils';
import { useChatMessageContext } from './ChatContext';

export type ChatMessageBubbleProps = {
  /** Bubble content — plain text or a consumer-rendered markdown tree. */
  children: ReactNode;
  /** Visual variant. `ghost` drops the background but keeps padding for alignment. @default filled */
  variant?: 'filled' | 'ghost';
  /** Position within a multi-bubble group from the same sender — tightens corners. */
  group?: 'first' | 'middle' | 'last';
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * The chat "bubble." Reads `sender` from an ancestor `ChatMessage` to
 * auto-style background/text color; defaults to `assistant` outside one.
 *
 * ```tsx
 * <ChatMessage sender="assistant">
 *   <ChatMessageBubble>Hello!</ChatMessageBubble>
 * </ChatMessage>
 * ```
 */
export function ChatMessageBubble({
  children,
  variant = 'filled',
  group,
  className,
}: ChatMessageBubbleProps): JSX.Element {
  const context = useChatMessageContext();
  const sender = context?.sender ?? 'assistant';
  const b = chatMessageBubble({ sender, variant, group: group ?? 'none' });
  return <div className={cx(b.root, className)}>{children}</div>;
}
````

- [ ] **Step 9: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 10: Export from react barrels**

Create `packages/react/src/components/chat/index.ts`:

```ts
export { ChatMessageBubble, type ChatMessageBubbleProps } from './ChatMessageBubble';
```

In `packages/react/src/components/index.ts`, add:

```ts
export * from './chat';
```

- [ ] **Step 11: Commit**

```bash
git add packages/core/src/components/chat packages/core/src/components/index.ts packages/react/src/components/chat packages/react/src/components/index.ts
git commit -m "$(cat <<'EOF'
feat(core,react): add chatMessageBubble recipe and ChatMessageBubble

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: `chatMessage` recipe + `ChatMessage`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatMessage.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatMessage.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessage.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessage.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Consumes: `ChatMessageContext`, `useChatListContext` from Task 2.
- Produces:

```ts
function chatMessage(props: { sender?: 'user' | 'assistant' }): {
  root: string;
  avatar: string;
  header: string;
  name: string;
  content: string;
  metadata: string;
};
type ChatMessageProps = {
  sender: 'user' | 'assistant';
  name?: ReactNode;
  avatar?: ReactNode;
  metadata?: ReactNode;
  children: ReactNode;
  className?: string;
};
function ChatMessage(props: ChatMessageProps): JSX.Element;
```

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/chat/chatMessage.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessage } from './chatMessage';

describe('chatMessage', () => {
  it('registers slots and the sender variant', () => {
    chatMessage({ sender: 'user' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-message-root');
    expect(css).toContain('var-ui-chat-message-avatar');
    expect(css).toContain('var-ui-chat-message-header');
    expect(css).toContain('var-ui-chat-message-name');
    expect(css).toContain('var-ui-chat-message-content');
    expect(css).toContain('var-ui-chat-message-metadata');
    expect(css).toContain('var-ui-chat-message-root-sender-user');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement the recipe**

`packages/core/src/components/chat/chatMessage.ts`:

````ts
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * A message row: avatar + name/content/metadata. `sender` drives horizontal
 * alignment — `user` reverses the row so the avatar (if any) sits on the
 * trailing edge and text aligns to the end.
 *
 * ```tsx
 * <div className={chatMessage({ sender: 'assistant' }).root}>…</div>
 * ```
 */
export const chatMessage = styles.component(
  'chat-message',
  () => ({
    slots: ['root', 'avatar', 'header', 'name', 'content', 'metadata'],
    base: {
      root: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: t.space[2],
      },
      avatar: {
        flexShrink: 0,
      },
      header: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
      },
      name: {
        fontSize: t.fontSize.sm,
        fontWeight: t.fontWeight.medium,
        color: t.color.text.secondary,
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
        minWidth: 0,
      },
      metadata: {
        fontSize: t.fontSize.xs,
        color: t.color.text.secondary,
      },
    },
    variants: {
      sender: {
        user: {
          root: { flexDirection: 'row-reverse' },
          header: { alignItems: 'flex-end' },
          content: { alignItems: 'flex-end' },
          metadata: { alignSelf: 'flex-end' },
        },
        assistant: {
          root: { flexDirection: 'row' },
          header: { alignItems: 'flex-start' },
          content: { alignItems: 'flex-start' },
          metadata: { alignSelf: 'flex-start' },
        },
      },
    },
    defaultVariants: { sender: 'assistant' },
  }),
  { layer: 'components' },
);
````

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from core barrel**

Add to `packages/core/src/components/chat/index.ts`:

```ts
export { chatMessage } from './chatMessage';
```

- [ ] **Step 6: Write the failing React test**

`packages/react/src/components/chat/ChatMessage.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './ChatMessage';
import { useChatMessageContext } from './ChatContext';

function SenderProbe() {
  const ctx = useChatMessageContext();
  return <span data-testid="probe">{ctx?.sender}</span>;
}

describe('ChatMessage', () => {
  it('renders name, children, and metadata', () => {
    render(
      <ChatMessage sender="assistant" name="Navi" metadata="2:30 PM">
        Hello!
      </ChatMessage>,
    );
    expect(screen.getByText('Navi')).toBeTruthy();
    expect(screen.getByText('Hello!')).toBeTruthy();
    expect(screen.getByText('2:30 PM')).toBeTruthy();
  });

  it('applies the sender variant class to the root', () => {
    const { container } = render(<ChatMessage sender="user">Hi</ChatMessage>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-message-root-sender-user',
    );
  });

  it('provides sender via ChatMessageContext to descendants', () => {
    render(
      <ChatMessage sender="user">
        <SenderProbe />
      </ChatMessage>,
    );
    expect(screen.getByTestId('probe').textContent).toBe('user');
  });

  it('renders the avatar slot when provided', () => {
    render(
      <ChatMessage sender="assistant" avatar={<span data-testid="av">A</span>}>
        Hi
      </ChatMessage>,
    );
    expect(screen.getByTestId('av')).toBeTruthy();
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 8: Implement**

`packages/react/src/components/chat/ChatMessage.tsx`:

````tsx
import type { JSX, ReactNode } from 'react';
import { chatMessage } from '@var-ui/core';
import { cx } from '../utils';
import { ChatMessageContext, type ChatSender, useChatListContext } from './ChatContext';

export type ChatMessageProps = {
  /** Who sent this message — drives alignment and the default bubble color. */
  sender: ChatSender;
  /** Sender name shown above the content. */
  name?: ReactNode;
  /** Avatar element — typically an existing `<Avatar>`. */
  avatar?: ReactNode;
  /** Metadata (timestamp, status) shown below the content. */
  metadata?: ReactNode;
  /** Message content — typically one or more `ChatMessageBubble`. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * A message row. Provides `sender` + `density` to descendants via
 * `ChatMessageContext` so `ChatMessageBubble` doesn't need every prop
 * repeated.
 *
 * ```tsx
 * <ChatMessage sender="assistant" name="Navi" avatar={<Avatar name="Navi" />}>
 *   <ChatMessageBubble>Hello!</ChatMessageBubble>
 * </ChatMessage>
 * ```
 */
export function ChatMessage({
  sender,
  name,
  avatar,
  metadata,
  children,
  className,
}: ChatMessageProps): JSX.Element {
  const listContext = useChatListContext();
  const density = listContext?.density ?? 'balanced';
  const m = chatMessage({ sender });
  return (
    <ChatMessageContext.Provider value={{ sender, density }}>
      <div className={cx(m.root, className)}>
        {avatar ? <div className={m.avatar}>{avatar}</div> : null}
        <div className={m.content}>
          {name ? (
            <div className={m.header}>
              <span className={m.name}>{name}</span>
            </div>
          ) : null}
          {children}
          {metadata ? <div className={m.metadata}>{metadata}</div> : null}
        </div>
      </div>
    </ChatMessageContext.Provider>
  );
}
````

- [ ] **Step 9: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 10: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export { ChatMessage, type ChatMessageProps } from './ChatMessage';
```

- [ ] **Step 11: Commit**

```bash
git add packages/core/src/components/chat packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(core,react): add chatMessage recipe and ChatMessage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: `chatMessageList` recipe + `ChatMessageList`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatMessageList.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatMessageList.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessageList.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessageList.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Consumes: `ChatListContext` from Task 2.
- Produces:

```ts
function chatMessageList(props: { density?: 'compact' | 'balanced' | 'spacious' }): {
  root: string;
  inner: string;
  emptyState: string;
};
type ChatMessageListProps = {
  children: ReactNode;
  emptyState?: ReactNode;
  isStreaming?: boolean;
  density?: 'compact' | 'balanced' | 'spacious';
  className?: string;
};
function ChatMessageList(props: ChatMessageListProps): JSX.Element;
```

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/chat/chatMessageList.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatMessageList } from './chatMessageList';

describe('chatMessageList', () => {
  it('registers slots and density variants', () => {
    chatMessageList({ density: 'compact' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-message-list-root');
    expect(css).toContain('var-ui-chat-message-list-inner');
    expect(css).toContain('var-ui-chat-message-list-emptyState');
    expect(css).toContain('var-ui-chat-message-list-inner-density-compact');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement the recipe**

`packages/core/src/components/chat/chatMessageList.ts`:

````ts
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * Presentational scroll container for chat messages. `density` controls
 * inner gap/padding; scroll/auto-scroll behavior is owned by `ChatLayout`
 * (or wire `useChatStreamScroll` yourself when used standalone).
 *
 * ```tsx
 * <div className={chatMessageList({ density: 'balanced' }).root}>…</div>
 * ```
 */
export const chatMessageList = styles.component(
  'chat-message-list',
  () => ({
    slots: ['root', 'inner', 'emptyState'],
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      },
      inner: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      },
      emptyState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: 0,
      },
    },
    variants: {
      density: {
        compact: { inner: { gap: t.space[2], padding: t.space[2] } },
        balanced: { inner: { gap: t.space[4], padding: t.space[4] } },
        spacious: { inner: { gap: t.space[6], padding: t.space[6] } },
      },
    },
    defaultVariants: { density: 'balanced' },
  }),
  { layer: 'components' },
);
````

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from core barrel**

Add to `packages/core/src/components/chat/index.ts`:

```ts
export { chatMessageList } from './chatMessageList';
```

- [ ] **Step 6: Write the failing React test**

`packages/react/src/components/chat/ChatMessageList.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessageList } from './ChatMessageList';

describe('ChatMessageList', () => {
  it('renders as a live log region', () => {
    render(<ChatMessageList>content</ChatMessageList>);
    const log = screen.getByRole('log');
    expect(log.getAttribute('aria-live')).toBe('polite');
    expect(log.hasAttribute('aria-busy')).toBe(false);
  });

  it('sets aria-busy while streaming', () => {
    render(<ChatMessageList isStreaming>content</ChatMessageList>);
    expect(screen.getByRole('log').getAttribute('aria-busy')).toBe('true');
  });

  it('renders emptyState when there are no children', () => {
    render(<ChatMessageList emptyState={<span>No messages yet</span>}>{null}</ChatMessageList>);
    expect(screen.getByText('No messages yet')).toBeTruthy();
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 8: Implement**

`packages/react/src/components/chat/ChatMessageList.tsx`:

````tsx
import type { JSX, ReactNode } from 'react';
import { chatMessageList } from '@var-ui/core';
import { cx } from '../utils';
import { ChatListContext, type ChatDensity } from './ChatContext';

export type ChatMessageListProps = {
  /** Message elements — typically `ChatMessage`. */
  children: ReactNode;
  /** Content shown when `children` is empty. */
  emptyState?: ReactNode;
  /**
   * Whether an assistant message is actively streaming. Sets `aria-busy` on
   * the `role="log"` region so screen readers announce the completed
   * message once, instead of re-announcing every streamed token.
   * @default false
   */
  isStreaming?: boolean;
  /** Visual density — flows to child messages via context. @default balanced */
  density?: ChatDensity;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

function hasVisibleContent(children: ReactNode): boolean {
  if (children == null || children === false) {
    return false;
  }
  return !(Array.isArray(children) && children.length === 0);
}

/**
 * Presentational container for chat messages — `role="log"` /
 * `aria-live="polite"` region with density-based spacing.
 *
 * ```tsx
 * <ChatMessageList isStreaming={isStreaming}>
 *   {messages.map((m) => <ChatMessage key={m.id} sender={m.sender}>…</ChatMessage>)}
 * </ChatMessageList>
 * ```
 */
export function ChatMessageList({
  children,
  emptyState,
  isStreaming = false,
  density = 'balanced',
  className,
}: ChatMessageListProps): JSX.Element {
  const l = chatMessageList({ density });
  return (
    <ChatListContext.Provider value={{ density }}>
      <div
        role="log"
        aria-live="polite"
        aria-busy={isStreaming || undefined}
        className={cx(l.root, className)}
      >
        <div className={l.inner}>
          {hasVisibleContent(children) ? (
            children
          ) : emptyState ? (
            <div className={l.emptyState}>{emptyState}</div>
          ) : null}
        </div>
      </div>
    </ChatListContext.Provider>
  );
}
````

- [ ] **Step 9: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 10: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export { ChatMessageList, type ChatMessageListProps } from './ChatMessageList';
```

- [ ] **Step 11: Commit**

```bash
git add packages/core/src/components/chat packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(core,react): add chatMessageList recipe and ChatMessageList

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: `chatSystemMessage` recipe + `ChatSystemMessage`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatSystemMessage.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatSystemMessage.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatSystemMessage.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatSystemMessage.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Consumes: `semanticTone`, `subtleBackgroundColor`, `SemanticToneKey` from `../semanticTone`.
- Produces:

```ts
function chatSystemMessage(props: {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
}): { root: string; icon: string; text: string };
type ChatSystemMessageProps = {
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};
function ChatSystemMessage(props: ChatSystemMessageProps): JSX.Element;
```

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/chat/chatSystemMessage.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatSystemMessage } from './chatSystemMessage';

describe('chatSystemMessage', () => {
  it('registers slots and tone variants', () => {
    chatSystemMessage({ tone: 'success' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-system-message-root');
    expect(css).toContain('var-ui-chat-system-message-icon');
    expect(css).toContain('var-ui-chat-system-message-text');
    expect(css).toContain('var-ui-chat-system-message-root-tone-success');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement the recipe**

`packages/core/src/components/chat/chatSystemMessage.ts`:

````ts
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { semanticTone, subtleBackgroundColor, type SemanticToneKey } from '../semanticTone';

function tonePaint(
  v: { color: { name: string }; background: { name: string } },
  key: SemanticToneKey,
) {
  const ch = semanticTone[key];
  return {
    root: {
      [v.color.name]: ch.semantic,
      [v.background.name]: subtleBackgroundColor(ch.semantic),
    },
  };
}

/**
 * Centered inline system message ("Alex joined", "Model switched to GPT-5").
 * Same tone vocabulary as `Alert`/`Badge`, plus a `neutral` default.
 *
 * ```tsx
 * <div className={chatSystemMessage({ tone: 'info' }).root}>…</div>
 * ```
 */
export const chatSystemMessage = styles.component(
  'chat-system-message',
  (c) => {
    const v = c.vars({
      color: { value: t.color.text.secondary, syntax: '<color>', inherits: false },
      background: { value: t.color.background.subtle, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'icon', 'text'],
      base: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.space[1],
          alignSelf: 'center',
          padding: `${t.space[1]} ${t.space[3]}`,
          borderRadius: t.radius.full,
          backgroundColor: v.background.var,
          color: v.color.var,
          fontSize: t.fontSize.sm,
        },
        icon: {
          display: 'inline-flex',
          flexShrink: 0,
        },
        text: {
          margin: 0,
        },
      },
      variants: {
        tone: {
          neutral: {},
          accent: tonePaint(v, 'accent'),
          success: tonePaint(v, 'success'),
          warning: tonePaint(v, 'warning'),
          danger: tonePaint(v, 'danger'),
          info: tonePaint(v, 'info'),
        },
      },
      defaultVariants: { tone: 'neutral' },
    };
  },
  { layer: 'components' },
);
````

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from core barrel**

Add to `packages/core/src/components/chat/index.ts`:

```ts
export { chatSystemMessage } from './chatSystemMessage';
```

- [ ] **Step 6: Write the failing React test**

`packages/react/src/components/chat/ChatSystemMessage.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatSystemMessage } from './ChatSystemMessage';

describe('ChatSystemMessage', () => {
  it('renders children with role status', () => {
    render(<ChatSystemMessage>Alex joined the conversation</ChatSystemMessage>);
    expect(screen.getByRole('status').textContent).toContain('Alex joined the conversation');
  });

  it('applies the tone variant class', () => {
    const { container } = render(<ChatSystemMessage tone="warning">Careful</ChatSystemMessage>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'var-ui-chat-system-message-root-tone-warning',
    );
  });

  it('renders an optional icon', () => {
    render(<ChatSystemMessage icon={<span data-testid="ic" />}>With icon</ChatSystemMessage>);
    expect(screen.getByTestId('ic')).toBeTruthy();
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 8: Implement**

`packages/react/src/components/chat/ChatSystemMessage.tsx`:

````tsx
import type { JSX, ReactNode } from 'react';
import { chatSystemMessage } from '@var-ui/core';
import { cx } from '../utils';

export type ChatSystemMessageTone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type ChatSystemMessageProps = {
  /** Semantic tone. @default neutral */
  tone?: ChatSystemMessageTone;
  /** Optional leading icon — pass an `<Icon name="…" />`. */
  icon?: ReactNode;
  /** Message text. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Centered inline system message — presence updates, mode switches, etc.
 *
 * ```tsx
 * <ChatSystemMessage tone="info">Model switched to GPT-5</ChatSystemMessage>
 * ```
 */
export function ChatSystemMessage({
  tone = 'neutral',
  icon,
  children,
  className,
}: ChatSystemMessageProps): JSX.Element {
  const s = chatSystemMessage({ tone });
  return (
    <div className={cx(s.root, className)} role="status">
      {icon ? <span className={s.icon}>{icon}</span> : null}
      <span className={s.text}>{children}</span>
    </div>
  );
}
````

- [ ] **Step 9: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 10: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export {
  ChatSystemMessage,
  type ChatSystemMessageProps,
  type ChatSystemMessageTone,
} from './ChatSystemMessage';
```

- [ ] **Step 11: Commit**

```bash
git add packages/core/src/components/chat packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(core,react): add chatSystemMessage recipe and ChatSystemMessage

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: `chatToolCalls` recipe + `ChatToolCalls`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatToolCalls.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatToolCalls.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatToolCalls.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatToolCalls.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Consumes: `semanticTone` from `../semanticTone`; `Icon` from `../../icons`; `Spinner` from `../Spinner`. Requires Task 1's `wrench`/`clock` icon names.
- Produces:

```ts
function chatToolCalls(props: {
  status?: 'pending' | 'running' | 'complete' | 'error';
  expanded?: 'true' | 'false';
}): {
  root: string;
  header: string;
  statusIcon: string;
  name: string;
  target: string;
  duration: string;
  chevron: string;
  list: string;
  detail: string;
};
type ChatToolCallStatus = 'pending' | 'running' | 'complete' | 'error';
type ChatToolCallItem = {
  name: string;
  status?: ChatToolCallStatus;
  target?: string;
  duration?: string;
  resultDetail?: ReactNode;
};
type ChatToolCallsProps = { calls: ChatToolCallItem[]; className?: string };
function ChatToolCalls(props: ChatToolCallsProps): JSX.Element | null;
```

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/chat/chatToolCalls.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatToolCalls } from './chatToolCalls';

describe('chatToolCalls', () => {
  it('registers slots and status/expanded variants', () => {
    chatToolCalls({ status: 'running', expanded: 'true' });
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-tool-calls-root');
    expect(css).toContain('var-ui-chat-tool-calls-header');
    expect(css).toContain('var-ui-chat-tool-calls-statusIcon-status-running');
    expect(css).toContain('var-ui-chat-tool-calls-chevron-expanded-true');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement the recipe**

`packages/core/src/components/chat/chatToolCalls.ts`:

````ts
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';
import { semanticTone } from '../semanticTone';

/**
 * Tool/function call display. One call renders inline; the React wrapper
 * collapses 2+ calls into an expandable group using the `expanded` variant
 * here for the chevron rotation only (the show/hide of the list itself is
 * plain conditional rendering in React — no CSS transition in v1).
 *
 * ```tsx
 * <div className={chatToolCalls({ status: 'running' }).root}>…</div>
 * ```
 */
export const chatToolCalls = styles.component(
  'chat-tool-calls',
  () => ({
    slots: [
      'root',
      'header',
      'statusIcon',
      'name',
      'target',
      'duration',
      'chevron',
      'list',
      'detail',
    ],
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
        marginTop: t.space[2],
      },
      header: {
        display: 'flex',
        alignItems: 'center',
        gap: t.space[1],
        minHeight: '24px',
        cursor: 'pointer',
        userSelect: 'none',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
      },
      statusIcon: {
        display: 'inline-flex',
        flexShrink: 0,
      },
      name: {
        fontSize: t.fontSize.sm,
        fontFamily: t.fontFamily.mono,
        fontWeight: t.fontWeight.medium,
        color: t.color.text.secondary,
      },
      target: {
        fontSize: t.fontSize.sm,
        color: t.color.text.secondary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      duration: {
        fontSize: t.fontSize.sm,
        color: t.color.text.secondary,
        flexShrink: 0,
      },
      chevron: {
        display: 'inline-flex',
        marginLeft: 'auto',
        transition: 'transform 0.15s ease',
      },
      list: {
        display: 'flex',
        flexDirection: 'column',
        gap: t.space[1],
        paddingLeft: t.space[4],
      },
      detail: {
        paddingLeft: t.space[4],
        paddingBottom: t.space[2],
      },
    },
    variants: {
      status: {
        pending: { statusIcon: { color: t.color.text.secondary } },
        running: { statusIcon: { color: semanticTone.accent.semantic } },
        complete: { statusIcon: { color: semanticTone.success.semantic } },
        error: { statusIcon: { color: semanticTone.danger.semantic } },
      },
      expanded: {
        true: { chevron: { transform: 'rotate(180deg)' } },
        false: {},
      },
    },
    defaultVariants: { status: 'complete', expanded: 'false' },
  }),
  { layer: 'components' },
);
````

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from core barrel**

Add to `packages/core/src/components/chat/index.ts`:

```ts
export { chatToolCalls } from './chatToolCalls';
```

- [ ] **Step 6: Write the failing React test**

`packages/react/src/components/chat/ChatToolCalls.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../../icons';
import { ChatToolCalls } from './ChatToolCalls';

describe('ChatToolCalls', () => {
  it('renders nothing for an empty calls array', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <ChatToolCalls calls={[]} />
      </IconProvider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a single call inline without a group header', () => {
    render(
      <IconProvider icons={{}}>
        <ChatToolCalls calls={[{ name: 'read_file', status: 'complete', target: 'App.tsx' }]} />
      </IconProvider>,
    );
    expect(screen.getByText('read_file')).toBeTruthy();
    expect(screen.getByText('App.tsx')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('collapses 2+ calls into an expandable group', async () => {
    render(
      <IconProvider icons={{}}>
        <ChatToolCalls
          calls={[
            { name: 'read_file', status: 'complete', target: 'App.tsx' },
            { name: 'run_tests', status: 'running' },
          ]}
        />
      </IconProvider>,
    );
    const toggle = screen.getByRole('button');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('read_file')).toBeNull();
    await userEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('read_file')).toBeTruthy();
    expect(screen.getByText('run_tests')).toBeTruthy();
  });

  it('toggles inline result detail for a call that has one', async () => {
    render(
      <IconProvider icons={{}}>
        <ChatToolCalls
          calls={[{ name: 'run_tests', status: 'complete', resultDetail: <span>42 passed</span> }]}
        />
      </IconProvider>,
    );
    expect(screen.queryByText('42 passed')).toBeNull();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('42 passed')).toBeTruthy();
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 8: Implement**

`packages/react/src/components/chat/ChatToolCalls.tsx`:

````tsx
import { useState, type JSX, type KeyboardEvent, type ReactNode } from 'react';
import { chatToolCalls } from '@var-ui/core';
import { cx } from '../utils';
import { Icon } from '../../icons';
import { Spinner } from '../Spinner';

export type ChatToolCallStatus = 'pending' | 'running' | 'complete' | 'error';

export type ChatToolCallItem = {
  /** Tool/function name. */
  name: string;
  /** Current execution status. @default complete */
  status?: ChatToolCallStatus;
  /** The target of the action (e.g. "Button.tsx", "yarn test"). */
  target?: string;
  /** Duration string (e.g. "1.2s"). Shown when complete. */
  duration?: string;
  /** Inline detail content shown when the row is expanded (e.g. a diff or command output). */
  resultDetail?: ReactNode;
};

export type ChatToolCallsProps = {
  /** Tool call data — mirrors the shape LLM APIs (Vercel AI SDK, Anthropic, OpenAI) return. */
  calls: ChatToolCallItem[];
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

function StatusIcon({ status }: { status: ChatToolCallStatus }) {
  if (status === 'running') {
    return <Spinner size="sm" label="Running" />;
  }
  if (status === 'pending') {
    return <Icon name="clock" size="sm" />;
  }
  return <Icon name={status === 'error' ? 'close' : 'check'} size="sm" />;
}

function ToolCallRow({ call }: { call: ChatToolCallItem }) {
  const status = call.status ?? 'complete';
  const [isOpen, setIsOpen] = useState(false);
  const hasDetail = call.resultDetail != null;
  const t = chatToolCalls({ status });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }

  return (
    <div>
      <div
        role={hasDetail ? 'button' : undefined}
        tabIndex={hasDetail ? 0 : undefined}
        aria-expanded={hasDetail ? isOpen : undefined}
        onClick={hasDetail ? () => setIsOpen((prev) => !prev) : undefined}
        onKeyDown={hasDetail ? handleKeyDown : undefined}
        className={t.header}
      >
        <span className={t.statusIcon}>
          <StatusIcon status={status} />
        </span>
        <span className={t.name}>{call.name}</span>
        {call.target ? <span className={t.target}>{call.target}</span> : null}
        {call.duration && status === 'complete' ? (
          <span className={t.duration}>{call.duration}</span>
        ) : null}
      </div>
      {hasDetail && isOpen ? <div className={t.detail}>{call.resultDetail}</div> : null}
    </div>
  );
}

/**
 * Displays tool/function call invocations from an LLM response. A single
 * call renders inline; 2+ calls collapse into an expandable summary group.
 *
 * ```tsx
 * <ChatToolCalls calls={message.toolCalls.map((tc) => ({ name: tc.toolName, status: tc.state }))} />
 * ```
 */
export function ChatToolCalls({ calls, className }: ChatToolCallsProps): JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(false);

  if (calls.length === 0) {
    return null;
  }

  const classes = chatToolCalls({ expanded: isExpanded ? 'true' : 'false' });

  if (calls.length === 1) {
    return (
      <div className={cx(classes.root, className)}>
        <ToolCallRow call={calls[0]} />
      </div>
    );
  }

  const latest = calls[calls.length - 1];

  return (
    <div className={cx(classes.root, className)}>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        className={classes.header}
      >
        <span className={classes.statusIcon}>
          <Icon name="wrench" size="sm" />
        </span>
        <span className={classes.name}>
          {isExpanded ? `${calls.length} tool calls` : latest.name}
        </span>
        <span className={classes.chevron}>
          <Icon name="chevronDown" size="sm" />
        </span>
      </button>
      {isExpanded ? (
        <div className={classes.list}>
          {calls.map((call, index) => (
            <ToolCallRow key={`${call.name}-${index}`} call={call} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
````

- [ ] **Step 9: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 10: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export {
  ChatToolCalls,
  type ChatToolCallItem,
  type ChatToolCallsProps,
  type ChatToolCallStatus,
} from './ChatToolCalls';
```

- [ ] **Step 11: Commit**

```bash
git add packages/core/src/components/chat packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(core,react): add chatToolCalls recipe and ChatToolCalls

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: `chatComposer` recipe + `ChatComposerInput` + `ChatComposer`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatComposer.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatComposer.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatComposerInput.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatComposerInput.test.tsx`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatComposer.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatComposer.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Produces:

```ts
function chatComposer(): { root: string; inputRow: string; input: string; actions: string };
type ChatComposerInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  maxRows?: number;
  isDisabled?: boolean;
  className?: string;
};
function ChatComposerInput(props: ChatComposerInputProps): JSX.Element;
type ChatComposerProps = { children: ReactNode; actions?: ReactNode; className?: string };
function ChatComposer(props: ChatComposerProps): JSX.Element;
```

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/chat/chatComposer.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatComposer } from './chatComposer';

describe('chatComposer', () => {
  it('registers all slots', () => {
    chatComposer();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-composer-root');
    expect(css).toContain('var-ui-chat-composer-inputRow');
    expect(css).toContain('var-ui-chat-composer-input');
    expect(css).toContain('var-ui-chat-composer-actions');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement the recipe**

`packages/core/src/components/chat/chatComposer.ts`:

````ts
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * Composer chrome: a bordered container around the message textarea and a
 * trailing actions slot (typically the send button).
 *
 * ```tsx
 * const c = chatComposer();
 * <div className={c.root}>
 *   <div className={c.inputRow}><textarea className={c.input} /></div>
 *   <div className={c.actions}>{sendButton}</div>
 * </div>
 * ```
 */
export const chatComposer = styles.component(
  'chat-composer',
  (c) => {
    const v = c.vars({
      border: { value: t.color.border.default, syntax: '<color>', inherits: false },
      background: { value: t.color.background.surface, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'inputRow', 'input', 'actions'],
      base: {
        root: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: t.space[2],
          padding: t.space[2],
          border: `1px solid ${v.border.var}`,
          borderRadius: t.radius.lg,
          backgroundColor: v.background.var,
        },
        inputRow: {
          flex: 1,
          minWidth: 0,
          display: 'flex',
        },
        input: {
          flex: 1,
          minWidth: 0,
          resize: 'none',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'inherit',
          fontSize: t.fontSize.md,
          lineHeight: '22px',
          color: t.color.text.primary,
          padding: t.space[1],
          '&::placeholder': { color: t.color.text.secondary },
        },
        actions: {
          display: 'flex',
          alignItems: 'center',
          gap: t.space[1],
          flexShrink: 0,
        },
      },
    };
  },
  { layer: 'components' },
);
````

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from core barrel**

Add to `packages/core/src/components/chat/index.ts`:

```ts
export { chatComposer } from './chatComposer';
```

- [ ] **Step 6: Write the failing React test for `ChatComposerInput`**

`packages/react/src/components/chat/ChatComposerInput.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatComposerInput } from './ChatComposerInput';

describe('ChatComposerInput', () => {
  it('renders the controlled value and calls onChange on typing', async () => {
    const onChange = vi.fn();
    render(
      <ChatComposerInput
        value=""
        onChange={onChange}
        onSubmit={vi.fn()}
        placeholder="Type a message…"
      />,
    );
    const textarea = screen.getByPlaceholderText('Type a message…');
    await userEvent.type(textarea, 'h');
    expect(onChange).toHaveBeenCalledWith('h');
  });

  it('submits trimmed value on Enter and does not insert a newline', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposerInput value="hello" onChange={vi.fn()} onSubmit={onSubmit} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
  });

  it('does not submit on Shift+Enter', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposerInput value="hello" onChange={vi.fn()} onSubmit={onSubmit} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit an empty/whitespace-only value', async () => {
    const onSubmit = vi.fn();
    render(<ChatComposerInput value="   " onChange={vi.fn()} onSubmit={onSubmit} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 8: Implement `ChatComposerInput`**

`packages/react/src/components/chat/ChatComposerInput.tsx`:

````tsx
import { useLayoutEffect, useRef, type JSX, type KeyboardEvent } from 'react';
import { TextArea, TextField as AriaTextField } from 'react-aria-components';
import { chatComposer } from '@var-ui/core';
import { cx } from '../utils';

export type ChatComposerInputProps = {
  /** Controlled value. */
  value: string;
  /** Change handler. */
  onChange: (value: string) => void;
  /** Submit handler — called with the trimmed value on Enter (without Shift). */
  onSubmit: (value: string) => void;
  /** Placeholder text. @default 'Type a message…' */
  placeholder?: string;
  /** Max rows before the textarea scrolls instead of growing. @default 8 */
  maxRows?: number;
  /** Disabled state. @default false */
  isDisabled?: boolean;
  /** Additional CSS class names merged onto the textarea. */
  className?: string;
};

const LINE_HEIGHT_PX = 22;

/**
 * Auto-resizing message textarea. Enter submits (trimmed, non-empty only);
 * Shift+Enter inserts a newline.
 *
 * ```tsx
 * <ChatComposerInput value={value} onChange={setValue} onSubmit={sendMessage} />
 * ```
 */
export function ChatComposerInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message…',
  maxRows = 8,
  isDisabled = false,
  className,
}: ChatComposerInputProps): JSX.Element {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const c = chatComposer();

  useLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el) {
      return;
    }
    el.style.height = 'auto';
    const maxHeight = maxRows * LINE_HEIGHT_PX;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value, maxRows]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        onSubmit(trimmed);
      }
    }
  }

  return (
    <AriaTextField
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      aria-label="Message"
      className={c.inputRow}
    >
      <TextArea
        ref={textAreaRef}
        className={cx(c.input, className)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        rows={1}
      />
    </AriaTextField>
  );
}
````

- [ ] **Step 9: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 10: Write the failing React test for `ChatComposer`**

`packages/react/src/components/chat/ChatComposer.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatComposer } from './ChatComposer';
import { ChatComposerInput } from './ChatComposerInput';

describe('ChatComposer', () => {
  it('renders children and the actions slot', () => {
    render(
      <ChatComposer actions={<button type="button">Send</button>}>
        <ChatComposerInput value="" onChange={() => {}} onSubmit={() => {}} />
      </ChatComposer>,
    );
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
  });

  it('omits the actions wrapper when no actions are passed', () => {
    const { container } = render(
      <ChatComposer>
        <span>input</span>
      </ChatComposer>,
    );
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
```

- [ ] **Step 11: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 12: Implement `ChatComposer`**

`packages/react/src/components/chat/ChatComposer.tsx`:

````tsx
import type { JSX, ReactNode } from 'react';
import { chatComposer } from '@var-ui/core';
import { cx } from '../utils';

export type ChatComposerProps = {
  /** Composer input — typically `ChatComposerInput`. */
  children: ReactNode;
  /** Trailing actions — typically `ChatSendButton`. */
  actions?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Bordered composer chrome around the message input and trailing actions.
 *
 * ```tsx
 * <ChatComposer actions={<ChatSendButton onPress={send} />}>
 *   <ChatComposerInput value={value} onChange={setValue} onSubmit={send} />
 * </ChatComposer>
 * ```
 */
export function ChatComposer({ children, actions, className }: ChatComposerProps): JSX.Element {
  const c = chatComposer();
  return (
    <div className={cx(c.root, className)}>
      {children}
      {actions ? <div className={c.actions}>{actions}</div> : null}
    </div>
  );
}
````

- [ ] **Step 13: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 14: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export { ChatComposer, type ChatComposerProps } from './ChatComposer';
export { ChatComposerInput, type ChatComposerInputProps } from './ChatComposerInput';
```

- [ ] **Step 15: Commit**

```bash
git add packages/core/src/components/chat packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(core,react): add chatComposer recipe, ChatComposerInput, and ChatComposer

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: `ChatSendButton`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatSendButton.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatSendButton.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Consumes: `Button` from `../Button`; `Icon` from `../../icons`. Requires Task 1's `arrowUp`/`stop` icon names.
- Produces:

```ts
type ChatSendButtonProps = {
  isStreaming?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  onStop?: () => void;
  className?: string;
};
function ChatSendButton(props: ChatSendButtonProps): JSX.Element;
```

- [ ] **Step 1: Write the failing test**

`packages/react/src/components/chat/ChatSendButton.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../../icons';
import { ChatSendButton } from './ChatSendButton';

describe('ChatSendButton', () => {
  it('calls onPress when not streaming', async () => {
    const onPress = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton onPress={onPress} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onStop and swaps the label while streaming', async () => {
    const onStop = vi.fn();
    render(
      <IconProvider icons={{}}>
        <ChatSendButton isStreaming onStop={onStop} />
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('disables the button when isDisabled and not streaming', () => {
    render(
      <IconProvider icons={{}}>
        <ChatSendButton isDisabled />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Send message' }).hasAttribute('disabled')).toBe(
      true,
    );
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement**

`packages/react/src/components/chat/ChatSendButton.tsx`:

````tsx
import type { JSX } from 'react';
import { Button } from '../Button';
import { Icon } from '../../icons';

export type ChatSendButtonProps = {
  /** Whether an assistant reply is currently streaming — swaps send → stop. @default false */
  isStreaming?: boolean;
  /** Disables the button. Ignored while streaming (stop stays pressable). @default false */
  isDisabled?: boolean;
  /** Called on press when not streaming. */
  onPress?: () => void;
  /** Called on press while streaming (cancel). */
  onStop?: () => void;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Send/stop button for a chat composer. Reuses the existing `Button` +
 * `Icon` rather than a dedicated recipe.
 *
 * ```tsx
 * <ChatSendButton isStreaming={isStreaming} onPress={send} onStop={cancel} />
 * ```
 */
export function ChatSendButton({
  isStreaming = false,
  isDisabled = false,
  onPress,
  onStop,
  className,
}: ChatSendButtonProps): JSX.Element {
  return (
    <Button
      intent="primary"
      className={className}
      isDisabled={isStreaming ? false : isDisabled}
      aria-label={isStreaming ? 'Stop generating' : 'Send message'}
      onPress={isStreaming ? onStop : onPress}
    >
      <Icon name={isStreaming ? 'stop' : 'arrowUp'} size="sm" />
    </Button>
  );
}
````

- [ ] **Step 4: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export { ChatSendButton, type ChatSendButtonProps } from './ChatSendButton';
```

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(react): add ChatSendButton

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: `useChatStreamScroll` hook

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/chat/useChatStreamScroll.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/chat/useChatStreamScroll.test.tsx`

**Interfaces:**

- Produces (consumed by Task 12's `ChatLayout`):

```ts
type UseChatStreamScrollOptions = {
  scrollRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  lockThreshold?: number;
  buttonThreshold?: number;
};
type UseChatStreamScrollReturn = {
  isLocked: boolean;
  isScrolledUp: boolean;
  scrollToBottom: () => void;
  lock: () => void;
  unlock: () => void;
  scrollIfLocked: () => void;
};
function useChatStreamScroll(options: UseChatStreamScrollOptions): UseChatStreamScrollReturn;
```

This is a simplified port of `~/dev/astryx/packages/core/src/Chat/useChatStreamScroll.ts` — native `scrollTo({ behavior: 'smooth' })` instead of a hand-rolled rAF spring, and no `scrollend`-based re-lock (jsdom/most browsers don't fire it reliably; re-locking here happens directly in the `scroll` handler once distance-from-bottom is within `lockThreshold`).

- [ ] **Step 1: Write the failing test**

`packages/react/src/chat/useChatStreamScroll.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useChatStreamScroll } from './useChatStreamScroll';

function mockScrollMetrics(
  el: HTMLElement,
  {
    scrollTop,
    scrollHeight,
    clientHeight,
  }: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  },
) {
  Object.defineProperty(el, 'scrollTop', { value: scrollTop, writable: true, configurable: true });
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true });
  el.scrollTo = () => {};
}

describe('useChatStreamScroll', () => {
  it('starts locked and unlocked-state-false', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 0, scrollHeight: 100, clientHeight: 100 });
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));
    expect(result.current.isLocked).toBe(true);
    expect(result.current.isScrolledUp).toBe(false);
  });

  it('unlocks when the user scrolls up', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 500, scrollHeight: 1000, clientHeight: 200 });
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));

    mockScrollMetrics(el, { scrollTop: 300, scrollHeight: 1000, clientHeight: 200 });
    act(() => {
      el.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isLocked).toBe(false);
    expect(result.current.isScrolledUp).toBe(true);
  });

  it('re-locks once scrolled back within lockThreshold of the bottom', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 300, scrollHeight: 1000, clientHeight: 200 });
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));

    act(() => {
      mockScrollMetrics(el, { scrollTop: 100, scrollHeight: 1000, clientHeight: 200 });
      el.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isLocked).toBe(false);

    act(() => {
      mockScrollMetrics(el, { scrollTop: 795, scrollHeight: 1000, clientHeight: 200 });
      el.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isLocked).toBe(true);
  });

  it('scrollToBottom locks and calls scrollTo', () => {
    const el = document.createElement('div');
    mockScrollMetrics(el, { scrollTop: 100, scrollHeight: 1000, clientHeight: 200 });
    let calledWith: unknown;
    el.scrollTo = (opts: unknown) => {
      calledWith = opts;
    };
    const ref = { current: el };
    const { result } = renderHook(() => useChatStreamScroll({ scrollRef: ref }));

    act(() => {
      mockScrollMetrics(el, { scrollTop: 100, scrollHeight: 1000, clientHeight: 200 });
      el.dispatchEvent(new Event('scroll'));
    });
    act(() => {
      result.current.scrollToBottom();
    });
    expect(result.current.isLocked).toBe(true);
    expect(calledWith).toEqual({ top: 800, behavior: 'smooth' });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

`packages/react/src/chat/useChatStreamScroll.ts`:

```ts
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type UseChatStreamScrollOptions = {
  /** Ref to the scrollable container element. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Whether scroll behavior is enabled. @default true */
  enabled?: boolean;
  /** Distance from bottom (px) within which scrolling back re-locks. @default 10 */
  lockThreshold?: number;
  /** Distance from bottom (px) beyond which the scroll-to-bottom button should show. @default 100 */
  buttonThreshold?: number;
};

export type UseChatStreamScrollReturn = {
  /** Whether the user has scrolled up past `buttonThreshold`. */
  isScrolledUp: boolean;
  /** Whether auto-scroll is locked (following content). */
  isLocked: boolean;
  /** Scroll to the bottom of the container and re-lock. */
  scrollToBottom: () => void;
  /** Lock auto-scroll and scroll to bottom. */
  lock: () => void;
  /** Unlock auto-scroll. */
  unlock: () => void;
  /** Scroll to bottom if currently locked. Call on content resize. */
  scrollIfLocked: () => void;
};

/**
 * Lock-to-bottom auto-scroll for streaming content. Locked (default)
 * auto-scrolls to bottom as content grows; scrolling up unlocks
 * immediately; scrolling back within `lockThreshold` of the bottom
 * re-locks. Simplified vs. Astryx's hand-rolled rAF spring — uses native
 * `scrollTo({ behavior: 'smooth' })`.
 */
export function useChatStreamScroll({
  scrollRef,
  enabled = true,
  lockThreshold = 10,
  buttonThreshold = 100,
}: UseChatStreamScrollOptions): UseChatStreamScrollReturn {
  const [isLocked, setIsLocked] = useState(true);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const lockedRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const lastScrollHeightRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    lockedRef.current = true;
    setIsLocked(true);
    setIsScrolledUp(false);
    el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior: 'smooth' });
  }, [scrollRef]);

  const lock = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const unlock = useCallback(() => {
    lockedRef.current = false;
    setIsLocked(false);
  }, []);

  const scrollIfLocked = useCallback(() => {
    const el = scrollRef.current;
    if (!enabled || !lockedRef.current || !el) {
      return;
    }
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }, [enabled, scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !enabled) {
      return;
    }

    lastScrollTopRef.current = el.scrollTop;
    lastScrollHeightRef.current = el.scrollHeight;

    function onScroll() {
      const target = el as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsScrolledUp(distanceFromBottom > buttonThreshold);

      const scrollHeightChanged = scrollHeight !== lastScrollHeightRef.current;
      lastScrollHeightRef.current = scrollHeight;

      if (scrollHeightChanged) {
        // Synthetic scroll from content resize — don't change lock state.
        lastScrollTopRef.current = scrollTop;
        return;
      }

      const isScrollingUp = scrollTop < lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;

      if (isScrollingUp && lockedRef.current) {
        lockedRef.current = false;
        setIsLocked(false);
      } else if (distanceFromBottom <= lockThreshold && !lockedRef.current) {
        lockedRef.current = true;
        setIsLocked(true);
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef, enabled, lockThreshold, buttonThreshold]);

  return { isLocked, isScrolledUp, scrollToBottom, lock, unlock, scrollIfLocked };
}
```

- [ ] **Step 4: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/chat
git commit -m "$(cat <<'EOF'
feat(react): add useChatStreamScroll hook

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: `useChatNewMessages` hook

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/chat/useChatNewMessages.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/chat/useChatNewMessages.test.tsx`

**Interfaces:**

- Produces (consumed by Task 12's `ChatLayout`):

```ts
type UseChatNewMessagesOptions = { isLocked: boolean; onResize?: () => void };
type UseChatNewMessagesReturn = {
  hasNewMessages: boolean;
  contentRef: (el: HTMLElement | null) => void;
  dismiss: () => void;
};
function useChatNewMessages(options: UseChatNewMessagesOptions): UseChatNewMessagesReturn;
```

- [ ] **Step 1: Write the failing test**

`packages/react/src/chat/useChatNewMessages.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vite-plus/test';
import { act, renderHook } from '@testing-library/react';
import { useChatNewMessages } from './useChatNewMessages';

type ResizeCallback = () => void;

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  callback: ResizeCallback;
  constructor(callback: ResizeCallback) {
    this.callback = callback;
    FakeResizeObserver.instances.push(this);
  }
  observe() {}
  disconnect() {}
  trigger() {
    this.callback();
  }
}

describe('useChatNewMessages', () => {
  it('calls onResize when locked and content grows', () => {
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    FakeResizeObserver.instances = [];
    const onResize = vi.fn();
    const { result } = renderHook(() => useChatNewMessages({ isLocked: true, onResize }));

    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
    act(() => {
      result.current.contentRef(el);
    });

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });

    expect(onResize).toHaveBeenCalledTimes(1);
    expect(result.current.hasNewMessages).toBe(false);
  });

  it('sets hasNewMessages when unlocked and content grows, and dismiss clears it', () => {
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
    FakeResizeObserver.instances = [];
    const { result } = renderHook(() => useChatNewMessages({ isLocked: false }));

    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
    act(() => {
      result.current.contentRef(el);
    });

    Object.defineProperty(el, 'scrollHeight', { value: 200, configurable: true });
    act(() => {
      FakeResizeObserver.instances[0].trigger();
    });
    expect(result.current.hasNewMessages).toBe(true);

    act(() => {
      result.current.dismiss();
    });
    expect(result.current.hasNewMessages).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement**

`packages/react/src/chat/useChatNewMessages.ts`:

```ts
import { useCallback, useRef, useState } from 'react';

export type UseChatNewMessagesOptions = {
  /** Current lock state from `useChatStreamScroll`. */
  isLocked: boolean;
  /** Called when content grows while locked — typically `scroll.scrollIfLocked`. */
  onResize?: () => void;
};

export type UseChatNewMessagesReturn = {
  /** Whether content grew while unlocked (drives a "New messages" button). */
  hasNewMessages: boolean;
  /** Callback ref — attach to the element whose height grows as messages stream in. */
  contentRef: (el: HTMLElement | null) => void;
  /** Clear `hasNewMessages` — call when the user scrolls to the latest message. */
  dismiss: () => void;
};

/**
 * Tracks content growth via `ResizeObserver`. While locked, calls
 * `onResize` (typically re-triggering auto-scroll); while unlocked, flags
 * `hasNewMessages` so a caller can surface a "New messages" affordance.
 */
export function useChatNewMessages({
  isLocked,
  onResize,
}: UseChatNewMessagesOptions): UseChatNewMessagesReturn {
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);
  const lastHeightRef = useRef(0);

  const contentRef = useCallback(
    (el: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!el) {
        return;
      }
      lastHeightRef.current = el.scrollHeight;
      const observer = new ResizeObserver(() => {
        const nextHeight = el.scrollHeight;
        if (nextHeight > lastHeightRef.current) {
          if (isLocked) {
            onResize?.();
          } else {
            setHasNewMessages(true);
          }
        }
        lastHeightRef.current = nextHeight;
      });
      observer.observe(el);
      observerRef.current = observer;
    },
    [isLocked, onResize],
  );

  const dismiss = useCallback(() => setHasNewMessages(false), []);

  return { hasNewMessages, contentRef, dismiss };
}
```

- [ ] **Step 4: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/chat
git commit -m "$(cat <<'EOF'
feat(react): add useChatNewMessages hook

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: `chatLayout` recipe + `ChatLayout`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatLayout.ts`
- Test: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/chatLayout.test.ts`
- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatLayout.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatLayout.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/core/src/components/chat/index.ts`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Consumes: `useChatStreamScroll` (Task 10), `useChatNewMessages` (Task 11), `Button` from `../Button`, `Icon` from `../../icons`.
- Produces:

```ts
function chatLayout(): { root: string; messageArea: string; dock: string };
type ChatLayoutProps = {
  children: ReactNode;
  composer: ReactNode;
  emptyState?: ReactNode;
  scrollButton?: ReactNode | null;
  scrollRef?: RefObject<HTMLElement | null>;
  className?: string;
};
function ChatLayout(props: ChatLayoutProps): JSX.Element;
```

Implementation note vs. `specs/chat-components.md`: this task simplifies the dock to a solid-background bar with a top border, dropping the spec-mentioned frosted-glass `blurLayer` slot — a backdrop-filter blur is a visual flourish, not essential to the streaming-chat MVP, and can be added later without an API change (it would only add a slot + CSS, not touch `ChatLayoutProps`).

- [ ] **Step 1: Write the failing core test**

`packages/core/src/components/chat/chatLayout.test.ts`:

```ts
import { describe, expect, it } from 'vite-plus/test';
import { getRegisteredCss } from 'typestyles';
import { chatLayout } from './chatLayout';

describe('chatLayout', () => {
  it('registers root, messageArea, and dock slots', () => {
    chatLayout();
    const css = getRegisteredCss();
    expect(css).toContain('var-ui-chat-layout-root');
    expect(css).toContain('var-ui-chat-layout-messageArea');
    expect(css).toContain('var-ui-chat-layout-dock');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement the recipe**

`packages/core/src/components/chat/chatLayout.ts`:

````ts
import { styles } from '../../runtime';
import { designTokens as t } from '../../tokens';

/**
 * Structural shell for a full chat interface: a scrollable message area
 * above a sticky composer dock. No JS measurement — density/spacing only.
 *
 * ```tsx
 * <div className={chatLayout().root}>…</div>
 * ```
 */
export const chatLayout = styles.component(
  'chat-layout',
  (c) => {
    const v = c.vars({
      background: { value: t.color.background.surface, syntax: '<color>', inherits: false },
      border: { value: t.color.border.default, syntax: '<color>', inherits: false },
    });
    return {
      slots: ['root', 'messageArea', 'dock'],
      base: {
        root: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        },
        messageArea: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        },
        dock: {
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space[2],
          padding: t.space[3],
          backgroundColor: v.background.var,
          borderTop: `1px solid ${v.border.var}`,
        },
      },
    };
  },
  { layer: 'components' },
);
````

- [ ] **Step 4: Run core tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from core barrel**

Add to `packages/core/src/components/chat/index.ts`:

```ts
export { chatLayout } from './chatLayout';
```

- [ ] **Step 6: Write the failing React test**

`packages/react/src/components/chat/ChatLayout.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../../icons';
import { ChatLayout } from './ChatLayout';

describe('ChatLayout', () => {
  it('renders children and the composer', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div data-testid="composer" />}>
          <div data-testid="messages">messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByTestId('messages')).toBeTruthy();
    expect(screen.getByTestId('composer')).toBeTruthy();
  });

  it('renders emptyState when there are no children', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} emptyState={<span>Start a conversation</span>}>
          {null}
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByText('Start a conversation')).toBeTruthy();
  });

  it('hides the scroll button entirely when scrollButton is null', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} scrollButton={null}>
          <div>messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders a custom scrollButton override', () => {
    render(
      <IconProvider icons={{}}>
        <ChatLayout composer={<div />} scrollButton={<button type="button">Custom</button>}>
          <div>messages</div>
        </ChatLayout>
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: 'Custom' })).toBeTruthy();
  });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 8: Implement**

`packages/react/src/components/chat/ChatLayout.tsx`:

````tsx
import { useRef, type JSX, type ReactNode, type RefObject } from 'react';
import { chatLayout } from '@var-ui/core';
import { cx } from '../utils';
import { Button } from '../Button';
import { Icon } from '../../icons';
import { useChatStreamScroll } from '../../chat/useChatStreamScroll';
import { useChatNewMessages } from '../../chat/useChatNewMessages';

export type ChatLayoutProps = {
  /** Message content — typically `ChatMessageList`. */
  children: ReactNode;
  /** Composer element, fixed to the bottom dock — typically `ChatComposer`. */
  composer: ReactNode;
  /** Content shown when `children` is empty. */
  emptyState?: ReactNode;
  /**
   * Scroll-to-bottom button rendered above the composer. Defaults to a
   * built-in button wired to `useChatStreamScroll`/`useChatNewMessages`.
   * Pass a custom node to override, or `null` to hide.
   */
  scrollButton?: ReactNode | null;
  /** External scroll container. When omitted, the message area itself scrolls. */
  scrollRef?: RefObject<HTMLElement | null>;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

function hasVisibleContent(children: ReactNode): boolean {
  if (children == null || children === false) {
    return false;
  }
  return !(Array.isArray(children) && children.length === 0);
}

/**
 * Layout shell for a full chat interface: scrollable messages above a
 * sticky composer dock, with a default "scroll to bottom / new messages"
 * button.
 *
 * ```tsx
 * <ChatLayout composer={<ChatComposer>…</ChatComposer>}>
 *   <ChatMessageList isStreaming={isStreaming}>…</ChatMessageList>
 * </ChatLayout>
 * ```
 */
export function ChatLayout({
  children,
  composer,
  emptyState,
  scrollButton,
  scrollRef: externalScrollRef,
  className,
}: ChatLayoutProps): JSX.Element {
  const messageAreaRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = externalScrollRef ?? messageAreaRef;
  const l = chatLayout();

  const scroll = useChatStreamScroll({ scrollRef: scrollContainerRef });
  const newMessages = useChatNewMessages({
    isLocked: scroll.isLocked,
    onResize: scroll.scrollIfLocked,
  });

  const showButton = scroll.isScrolledUp || newMessages.hasNewMessages;
  const defaultButton = showButton ? (
    <Button
      intent="secondary"
      onPress={() => {
        newMessages.dismiss();
        scroll.scrollToBottom();
      }}
    >
      <Icon name="chevronDown" size="sm" />
      {newMessages.hasNewMessages ? 'New messages' : 'Scroll to bottom'}
    </Button>
  ) : null;

  return (
    <div className={cx(l.root, className)}>
      <div
        className={l.messageArea}
        ref={(el) => {
          messageAreaRef.current = el;
          newMessages.contentRef(el);
        }}
      >
        {hasVisibleContent(children) ? children : (emptyState ?? null)}
      </div>
      <div className={l.dock}>
        {scrollButton === undefined ? defaultButton : scrollButton}
        {composer}
      </div>
    </div>
  );
}
````

- [ ] **Step 9: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 10: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export { ChatLayout, type ChatLayoutProps } from './ChatLayout';
```

- [ ] **Step 11: Commit**

```bash
git add packages/core/src/components/chat packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(core,react): add chatLayout recipe and ChatLayout

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: `ChatMessageMetadata`

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessageMetadata.tsx`
- Test: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/ChatMessageMetadata.test.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/components/chat/index.ts`

**Interfaces:**

- Consumes: `Timestamp`, `TimestampProps` from `../Timestamp`; `HStack` from `../Stack`. No new core recipe.
- Produces:

```ts
type ChatMessageMetadataProps = {
  date: Date | string | number;
  format?: 'relative' | 'date' | 'time' | 'datetime';
  status?: ReactNode;
  className?: string;
};
function ChatMessageMetadata(props: ChatMessageMetadataProps): JSX.Element;
```

- [ ] **Step 1: Write the failing test**

`packages/react/src/components/chat/ChatMessageMetadata.test.tsx`:

```tsx
import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { ChatMessageMetadata } from './ChatMessageMetadata';

describe('ChatMessageMetadata', () => {
  it('renders a Timestamp for the given date', () => {
    render(<ChatMessageMetadata date="2024-01-01T00:00:00.000Z" format="date" />);
    expect(screen.getByText(/2024|Jan/i)).toBeTruthy();
  });

  it('renders optional status content alongside the timestamp', () => {
    render(<ChatMessageMetadata date="2024-01-01T00:00:00.000Z" format="date" status="Read" />);
    expect(screen.getByText('Read')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `vp test run`
Expected: FAIL.

- [ ] **Step 3: Implement**

`packages/react/src/components/chat/ChatMessageMetadata.tsx`:

````tsx
import type { JSX, ReactNode } from 'react';
import { Timestamp, type TimestampProps } from '../Timestamp';
import { HStack } from '../Stack';

export type ChatMessageMetadataProps = {
  /** Passed straight to `Timestamp`. */
  date: TimestampProps['date'];
  /** Passed straight to `Timestamp`. @default relative */
  format?: TimestampProps['format'];
  /** Optional status content shown alongside the timestamp (e.g. "Read"). */
  status?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
};

/**
 * Thin composition of the existing `Timestamp` + optional status content —
 * no dedicated recipe.
 *
 * ```tsx
 * <ChatMessageMetadata date={message.sentAt} status="Read" />
 * ```
 */
export function ChatMessageMetadata({
  date,
  format = 'relative',
  status,
  className,
}: ChatMessageMetadataProps): JSX.Element {
  return (
    <HStack gap="xs" align="center" className={className}>
      <Timestamp date={date} format={format} />
      {status}
    </HStack>
  );
}
````

- [ ] **Step 4: Run tests — verify pass**

Run: `vp test run`
Expected: PASS.

- [ ] **Step 5: Export from react barrel**

Add to `packages/react/src/components/chat/index.ts`:

```ts
export { ChatMessageMetadata, type ChatMessageMetadataProps } from './ChatMessageMetadata';
```

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/components/chat
git commit -m "$(cat <<'EOF'
feat(react): add ChatMessageMetadata

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Package build + full export wiring check

**Files:**

- Modify: `/Users/danielbanks/dev/var-ui/packages/react/src/index.ts`

**Interfaces:**

- Verifies: everything exported from `packages/core/src/components/chat/index.ts` and `packages/react/src/components/chat/index.ts` (Tasks 3–13) flows through `packages/core/src/components/index.ts` → `packages/core/src/index.ts`, and `packages/react/src/components/index.ts` → `packages/react/src/index.ts`, so `@var-ui/core` and `@var-ui/react` consumers can `import { ChatLayout, ... } from '@var-ui/react'`.

- [ ] **Step 1: Confirm core barrel already re-exports chat (from Task 3)**

`packages/core/src/components/index.ts` should already contain `export * from './chat';` (added in Task 3, Step 5). Confirm it's there — no action needed if so.

- [ ] **Step 2: Confirm react components barrel already re-exports chat (from Task 3)**

`packages/react/src/components/index.ts` should already contain `export * from './chat';` (added in Task 3, Step 10). Confirm it's there.

- [ ] **Step 3: Add chat component + hook exports to `packages/react/src/index.ts`**

Add these lines to the existing `export { ... } from "./components";` block (alongside the existing named exports) and a new export for the chat hooks:

```ts
export {
  ChatLayout,
  type ChatLayoutProps,
  ChatMessageList,
  type ChatMessageListProps,
  ChatMessage,
  type ChatMessageProps,
  ChatMessageBubble,
  type ChatMessageBubbleProps,
  ChatComposer,
  type ChatComposerProps,
  ChatComposerInput,
  type ChatComposerInputProps,
  ChatSendButton,
  type ChatSendButtonProps,
  ChatToolCalls,
  type ChatToolCallsProps,
  type ChatToolCallItem,
  type ChatToolCallStatus,
  ChatSystemMessage,
  type ChatSystemMessageProps,
  type ChatSystemMessageTone,
  ChatMessageMetadata,
  type ChatMessageMetadataProps,
} from './components';
export {
  useChatStreamScroll,
  type UseChatStreamScrollOptions,
  type UseChatStreamScrollReturn,
} from './chat/useChatStreamScroll';
export {
  useChatNewMessages,
  type UseChatNewMessagesOptions,
  type UseChatNewMessagesReturn,
} from './chat/useChatNewMessages';
```

- [ ] **Step 4: Full workspace check + build**

Run: `vp check --fix`
Expected: no lint/type errors. If the typestyles public-classname lint rule flags new chat classes as needing a snapshot entry, follow its instructions to add them to `packages/core/.typestyles-public-classnames.json` — do not suppress the rule.

Run: `vp test run`
Expected: all tests across `packages/core`, `packages/react`, `packages/icons` pass.

Run: `vp run packages/core#build packages/react#build packages/icons#build`
Expected: all three packages build successfully, confirming the export graph resolves end-to-end.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/index.ts packages/core/.typestyles-public-classnames.json
git commit -m "$(cat <<'EOF'
feat(react): export chat components and hooks from @var-ui/react

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

(Omit `packages/core/.typestyles-public-classnames.json` from the `git add` if the lint rule required no changes.)

---

### Task 15: Example app streaming chat demo

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/examples/vite-app/src/ChatDemo.tsx`
- Modify: `/Users/danielbanks/dev/var-ui/examples/vite-app/src/App.tsx`

**Interfaces:**

- Consumes: all chat components + hooks exported in Task 14.
- Produces: a `<ChatDemo />` component mounted somewhere reachable in the existing example app's navigation/sections, exercised manually across all 8 built-in themes (no automated test — this is the manual QA surface for streaming/scroll behavior called out as a testing risk in `specs/chat-components.md`).

- [ ] **Step 1: Read the existing example app structure**

Read `/Users/danielbanks/dev/var-ui/examples/vite-app/src/App.tsx` to see how existing component sections/demos are laid out (theme switcher, section headings) so `ChatDemo` matches the established pattern rather than introducing a new one.

- [ ] **Step 2: Implement the demo**

`examples/vite-app/src/ChatDemo.tsx`:

```tsx
import { useState } from 'react';
import {
  Avatar,
  ChatComposer,
  ChatComposerInput,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatMessageMetadata,
  ChatSendButton,
  ChatSystemMessage,
  ChatToolCalls,
} from '@var-ui/react';

type DemoMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolCalls?: { name: string; status: 'complete' | 'running'; target?: string }[];
};

const ASSISTANT_REPLY =
  'Sure — I found the file, updated the export, and reran the test suite. Everything passes.';

function tokenize(text: string): string[] {
  return text.split(/(\s+)/);
}

export function ChatDemo() {
  const [messages, setMessages] = useState<DemoMessage[]>([
    { id: 'm1', sender: 'user', text: 'Can you add a Divider export to the react package?' },
  ]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');

  function handleSubmit(value: string) {
    const userMessage: DemoMessage = { id: crypto.randomUUID(), sender: 'user', text: value };
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    startAssistantReply();
  }

  function startAssistantReply() {
    setIsStreaming(true);
    setStreamedText('');
    const tokens = tokenize(ASSISTANT_REPLY);
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setStreamedText(tokens.slice(0, index).join(''));
      if (index >= tokens.length) {
        clearInterval(interval);
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'assistant',
            text: ASSISTANT_REPLY,
            toolCalls: [
              { name: 'read_file', status: 'complete', target: 'Divider.tsx' },
              { name: 'run_tests', status: 'complete', target: 'yarn test' },
            ],
          },
        ]);
      }
    }, 40);
  }

  return (
    <ChatLayout
      composer={
        <ChatComposer
          actions={<ChatSendButton isStreaming={isStreaming} onPress={() => handleSubmit(draft)} />}
        >
          <ChatComposerInput
            value={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            isDisabled={isStreaming}
          />
        </ChatComposer>
      }
    >
      <ChatMessageList isStreaming={isStreaming}>
        <ChatSystemMessage tone="info">Model: demo-assistant-1</ChatSystemMessage>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            sender={message.sender}
            name={message.sender === 'user' ? 'You' : 'Assistant'}
            avatar={<Avatar name={message.sender === 'user' ? 'You' : 'Assistant'} size="sm" />}
            metadata={<ChatMessageMetadata date={new Date()} format="time" />}
          >
            <ChatMessageBubble>{message.text}</ChatMessageBubble>
            {message.toolCalls ? <ChatToolCalls calls={message.toolCalls} /> : null}
          </ChatMessage>
        ))}
        {isStreaming ? (
          <ChatMessage
            sender="assistant"
            name="Assistant"
            avatar={<Avatar name="Assistant" size="sm" />}
          >
            <ChatMessageBubble>{streamedText}</ChatMessageBubble>
          </ChatMessage>
        ) : null}
      </ChatMessageList>
    </ChatLayout>
  );
}
```

- [ ] **Step 3: Mount the demo in the example app**

Following the pattern found in Step 1, add a `ChatDemo` section to `App.tsx` (import it, render it alongside the other component demos, e.g. under a "Chat" heading).

- [ ] **Step 4: Manual verification**

Run: `pnpm dev` (or the existing `vp run @var-ui/example-vite-app#dev` script from the root `package.json`)

Manually verify in the browser, across all 8 built-in themes via the existing theme switcher:

- Sending a message appends a user bubble, then streams an assistant reply token-by-token.
- The message list auto-scrolls to bottom while streaming.
- Scrolling up during streaming stops auto-scroll and shows the scroll-to-bottom button; clicking it returns to the bottom.
- The send button shows a stop icon while streaming and is disabled/re-enabled correctly around a submit.
- Tool calls render under the assistant's reply once streaming completes.
- User and assistant bubbles are visually distinct and legible in both light and dark faces of every theme.

- [ ] **Step 5: Commit**

```bash
git add examples/vite-app/src/ChatDemo.tsx examples/vite-app/src/App.tsx
git commit -m "$(cat <<'EOF'
feat(examples): add streaming chat demo exercising the chat components

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Component docs

**Files:**

- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-layout.mdx`
- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-message-list.mdx`
- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-message.mdx`
- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-message-bubble.mdx`
- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-composer.mdx`
- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-send-button.mdx`
- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-tool-calls.mdx`
- Create: `/Users/danielbanks/dev/var-ui/docs/content/components/chat-system-message.mdx`
- Modify: `/Users/danielbanks/dev/var-ui/docs/content/components/index.mdx`

**Interfaces:**

- Consumes: nothing new — pure documentation over Tasks 3–13's public APIs.

- [ ] **Step 1: Read an existing component doc for the house style**

Read `/Users/danielbanks/dev/var-ui/docs/content/components/card.mdx` (or `banner.mdx`) to match heading structure, prop-table formatting, and code-sample conventions used across the existing docs. Every page below follows that same structure: H1 title, one-paragraph description, a fenced usage example, then an `## Props` table with exactly the columns used in the file you just read (typically Prop / Type / Default).

- [ ] **Step 2: Write the worked example — `chat-message-bubble.mdx`**

`docs/content/components/chat-message-bubble.mdx`:

````mdx
# ChatMessageBubble

The chat "bubble" — a styled content container that reads `sender` from an
ancestor `ChatMessage` to auto-style its background and text color.

```tsx
<ChatMessage sender="assistant" name="Navi">
  <ChatMessageBubble>Hello! How can I help?</ChatMessageBubble>
</ChatMessage>
```
````

Use `group` when rendering several consecutive bubbles from the same
sender, to tighten the corners between them:

```tsx
<ChatMessage sender="user">
  <ChatMessageBubble group="first">First part of a multi-part reply.</ChatMessageBubble>
  <ChatMessageBubble group="last">Second part.</ChatMessageBubble>
</ChatMessage>
```

## Props

| Prop        | Type                            | Default    |
| ----------- | ------------------------------- | ---------- |
| `children`  | `ReactNode`                     | (required) |
| `variant`   | `'filled' \| 'ghost'`           | `'filled'` |
| `group`     | `'first' \| 'middle' \| 'last'` | —          |
| `className` | `string`                        | —          |

````

- [ ] **Step 3: Write the remaining 7 pages**

Each page's `## Props` table must contain exactly these rows (taken directly from the prop types defined in Tasks 3–13 — no invented props) and a usage example exercising every listed prop at least once:

- **`chat-layout.mdx`** (`ChatLayout`, Task 12): `children: ReactNode` (required), `composer: ReactNode` (required), `emptyState?: ReactNode` (—), `scrollButton?: ReactNode | null` (built-in button), `scrollRef?: React.RefObject<HTMLElement | null>` (—), `className?: string` (—). Usage example: `ChatLayout` wrapping a `ChatMessageList` and a `ChatComposer`, matching the shape in `examples/vite-app/src/ChatDemo.tsx` (Task 15) once that task has landed.
- **`chat-message-list.mdx`** (`ChatMessageList`, Task 5): `children: ReactNode` (required), `emptyState?: ReactNode` (—), `isStreaming?: boolean` (`false`), `density?: 'compact' | 'balanced' | 'spacious'` (`'balanced'`), `className?: string` (—). Usage example shows `isStreaming` toggling during a simulated reply.
- **`chat-message.mdx`** (`ChatMessage`, Task 4): `sender: 'user' | 'assistant'` (required), `name?: ReactNode` (—), `avatar?: ReactNode` (—), `metadata?: ReactNode` (—), `children: ReactNode` (required), `className?: string` (—). Usage example passes an `<Avatar>` and a `<ChatMessageMetadata>`.
- **`chat-composer.mdx`** (`ChatComposer`, `ChatComposerInput`, `ChatSendButton`; Tasks 8–9): document all three together. `ChatComposer` props: `children: ReactNode` (required), `actions?: ReactNode` (—), `className?: string` (—). `ChatComposerInput` props: `value: string` (required), `onChange: (value: string) => void` (required), `onSubmit: (value: string) => void` (required), `placeholder?: string` (`'Type a message…'`), `maxRows?: number` (`8`), `isDisabled?: boolean` (`false`), `className?: string` (—). `ChatSendButton` props: `isStreaming?: boolean` (`false`), `isDisabled?: boolean` (`false`), `onPress?: () => void` (—), `onStop?: () => void` (—), `className?: string` (—). Usage example wires all three together with `useState`, matching `ChatDemo.tsx`'s composer block.
- **`chat-send-button.mdx`**: cross-reference `chat-composer.mdx` for the full prop table (same component) — this page focuses on the standalone send/stop behavior with a minimal example toggling `isStreaming`.
- **`chat-tool-calls.mdx`** (`ChatToolCalls`, Task 7): `calls: ChatToolCallItem[]` (required) — document the `ChatToolCallItem` shape (`name: string`, `status?: 'pending' | 'running' | 'complete' | 'error'` default `'complete'`, `target?: string`, `duration?: string`, `resultDetail?: ReactNode`) as a nested type table, plus `className?: string` (—). Usage example shows both a single call (inline) and a 2+ call array (collapsible group) with one `resultDetail`.
- **`chat-system-message.mdx`** (`ChatSystemMessage`, Task 6): `tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'` (`'neutral'`), `icon?: ReactNode` (—), `children: ReactNode` (required), `className?: string` (—). Usage example shows two tones.
- **`chat-message-metadata`**: fold into `chat-message.mdx` as a "Metadata" subsection (not a separate top-level nav entry) — `ChatMessageMetadata` (Task 13) props: `date: Date | string | number` (required), `format?: 'relative' | 'date' | 'time' | 'datetime'` (`'relative'`), `status?: ReactNode` (—), `className?: string` (—).

- [ ] **Step 4: Add an index entry**

In `docs/content/components/index.mdx`, add a "Chat" section/group linking all 8 new pages (`chat-layout`, `chat-message-list`, `chat-message`, `chat-message-bubble`, `chat-composer`, `chat-send-button`, `chat-tool-calls`, `chat-system-message`), following the existing category grouping pattern (e.g. how "Feedback" or "Container" components are grouped there).

- [ ] **Step 5: Build the docs site to verify no errors**

Run: `vp run @var-ui/docs#build` (or `pnpm docs:build` from the root `package.json`)
Expected: build succeeds with no broken links or MDX errors referencing the new files.

- [ ] **Step 6: Commit**

```bash
git add docs/content/components
git commit -m "$(cat <<'EOF'
docs: add component pages for the chat suite

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
````

---

### Task 17: `ROADMAP.md` update

**Files:**

- Modify: `/Users/danielbanks/dev/var-ui/ROADMAP.md`

**Interfaces:**

- None — documentation only.

- [ ] **Step 1: Add a checklist entry**

In `ROADMAP.md`, add a new top-level checklist item (not nested under V6, since this shipped out of the Phase 2–6 order) directly after the V6 section:

```markdown
## Chat components

- [x] **Chat — "MVP + AI streaming essentials"** — `ChatLayout`,
      `ChatMessageList`, `ChatMessage`, `ChatMessageBubble`, `ChatComposer`/
      `ChatComposerInput`, `ChatSendButton`, `ChatToolCalls`,
      `ChatSystemMessage`, `ChatMessageMetadata`, plus `useChatStreamScroll`/
      `useChatNewMessages`. Shipped as its own initiative ahead of V6's
      Phase 2–6 ordering — see `specs/chat-components.md` for the scope
      decision. Deferred to a later PR: `ChatComposerDrawer`, mention/token
      composer input, `ChatDictationButton`, `ChatTokenizedText` (tracked
      under V6 Phase 7 in `specs/component-breadth.md`).
```

- [ ] **Step 2: Commit**

```bash
git add ROADMAP.md
git commit -m "$(cat <<'EOF'
docs: mark chat components complete on the roadmap

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```
