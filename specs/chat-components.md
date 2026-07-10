# Chat components

## Problem

`specs/component-breadth.md` reserves **Phase 7** for a Chat vertical and
leaves an explicit open decision: "full Astryx parity vs. slimmer 'message
list + composer' MVP for v1 of Phase 7?" Phase 7 is also ordered last,
gated behind Phases 2–6 (menus, overlays, tables, navigation, layout
polish) — none of which have started.

This spec answers that open decision and ships Chat as its **own initiative**,
ahead of the phase order, because the scope chosen here has no real
dependency on Phases 2–6: it only needs infrastructure that already exists
(`Icon`/`IconProvider`, `LayerProvider`, `Button`, typography, `CodeBlock`,
`Avatar`, `Timestamp`). Waiting for Toast/menus/tables buys nothing here.

**Scope for v1: "MVP + AI streaming essentials."** Not full parity with
Astryx's ~15-family Chat suite (`~/dev/astryx`, `packages/core/src/Chat/`).
Deferred to later PRs: `ChatComposerDrawer`, the contentEditable
mention/token composer input (`useTriggerMenu`, `useChatComposerTokens`),
`ChatDictationButton`/`useChatDictation`, `ChatTokenizedText`. `ChatReasoning`
stays lab-tier per the existing spec's Lab tier section.

## Design

### File layout

Chat is the first "vertical" large enough to warrant its own subfolder,
rather than the flat `components/` convention every other recipe uses:

```
packages/core/src/components/chat/
  chatLayout.ts
  chatMessageList.ts
  chatMessage.ts
  chatMessageBubble.ts
  chatComposer.ts
  chatToolCalls.ts
  chatSystemMessage.ts
  index.ts

packages/react/src/components/chat/
  ChatLayout.tsx
  ChatMessageList.tsx
  ChatMessage.tsx
  ChatMessageBubble.tsx
  ChatComposer.tsx
  ChatComposerInput.tsx
  ChatSendButton.tsx
  ChatToolCalls.tsx
  ChatSystemMessage.tsx
  ChatMessageMetadata.tsx
  index.ts

packages/react/src/chat/
  useChatStreamScroll.ts
  useChatNewMessages.ts
```

`chatSendButton` needs no new core recipe — it composes the existing
`button` recipe + `Icon`. `ChatMessageMetadata` needs no new core recipe
either — it composes the existing `Timestamp` component with optional
status text.

Every recipe follows the V3 override contract already used by
`card.ts`/`alert.ts`: themeable colors are exposed via `c.vars()`. Notably,
`chatMessageBubble` exposes separate `senderBackground`/`senderText` vars
per sender — Astryx's own bubble hardcodes both user and assistant to the
same neutral background in CSS-in-JS; var-ui themes can override them
independently. Semantic tone for `chatSystemMessage` reuses
`semanticTone.ts` (the same `accent`/`success`/`warning`/`danger`/`info`
vocabulary `Alert`/`Badge` already use), plus a `neutral` tone.

### Core recipes

- **`chatLayout`** — slots `root`, `messageArea`, `dock`, `blurLayer`,
  `dockInner`. Structural shell only: scrollable message area + a
  sticky/fixed composer dock. Density variant (`compact`/`balanced`/
  `spacious`) controls spacing only, no JS measurement.
- **`chatMessageList`** — slots `root`, `inner`, `spacer`, `emptyState`.
  Density/gap variants match `chatLayout`'s density scale.
- **`chatMessage`** — slots `root`, `avatar`, `header`, `name`, `content`,
  `metadata`. `sender` variant (`user`/`assistant`) drives alignment
  (row-reverse for `user`). Provides sender + density via React context so
  `ChatMessageBubble` doesn't need every prop repeated.
- **`chatMessageBubble`** — slot `root`. Variant axes: `sender` (background/
  text `c.vars()`), `variant` (`filled`/`ghost` — ghost drops the
  background but keeps padding for alignment), `group` (`first`/`middle`/
  `last` — tightens the sender-side corner radius for consecutive bubbles
  from the same sender, unset = full radius).
- **`chatComposer`** — slots `root`, `inputRow`, `actions`. Simple
  container; the actual input is `ChatComposerInput` (react-only, no
  dedicated recipe — reuses `textAreaField`'s chrome, see below).
- **`chatToolCalls`** — slots `root`, `header`, `statusIcon`, `list`,
  `row`, `detail`. Status colors (`pending`/`running`/`complete`/`error`)
  via `c.vars()` tied to `semanticTone`.
- **`chatSystemMessage`** — slots `root`, `icon`, `text`. Tone variant via
  `semanticTone.ts`, default `neutral`.

### React component APIs

- **`ChatLayout`** — `children` (message list), `composer` (dock content),
  `emptyState?`, `scrollButton?` (defaults to a built-in scroll-to-bottom
  pill wired to `useChatStreamScroll`/`useChatNewMessages`; pass `null` to
  hide), `scrollRef?` (scroll an external container instead of the layout
  root), `density?`.
- **`ChatMessageList`** — `children`, `emptyState?`, `isStreaming?:
boolean` (sets `aria-busy` on the `role="log"` region so screen readers
  wait for the full message instead of re-announcing every streamed
  token), `density?`, `gap?`.
- **`ChatMessage`** — `sender: 'user' | 'assistant'`, `name?`, `avatar?`
  (pass an existing `<Avatar>`), `metadata?`, `children`.
- **`ChatMessageBubble`** — `children: ReactNode` (render-prop model — var-ui
  does zero markdown parsing; consumers pass plain text or their own
  markdown-rendered tree, e.g. via `react-markdown` with a `code` override
  that renders var-ui's `<CodeBlock>`), `variant?`, `group?`.
- **`ChatComposer`** / **`ChatComposerInput`** — controlled `value`/
  `onChange`, `onSubmit(value)`, `placeholder?`, `maxRows?` (default 8,
  auto-grows then scrolls), `isDisabled?`. Built on RAC `TextField`/
  `TextArea` (**not** contentEditable — Astryx's rich mention/token input
  is explicitly deferred). Enter submits; Shift+Enter inserts a newline.
- **`ChatSendButton`** — `isStreaming?: boolean` (swaps the `arrowUp` glyph
  for `stop` and the press handler from send to cancel).
- **`ChatToolCalls`** — `calls: ChatToolCallItem[]` where each item is
  `{ name, status?, target?, duration?, resultDetail? }`. This shape
  mirrors what LLM APIs (Vercel AI SDK, Anthropic, OpenAI) already return
  on a message — matching Astryx's own design rationale for one data-driven
  component over compound parts. 1 call renders inline; 2+ collapse into
  an expandable summary row.
- **`ChatSystemMessage`** — `tone?`, `children`.
- **`ChatMessageMetadata`** — composition of `<Timestamp>` + optional
  status text, no new recipe.

### Hooks

Ported and simplified from Astryx's real implementation
(`~/dev/astryx/packages/core/src/Chat/useChatStreamScroll.ts`) — hand-rolled
since no RAC primitive covers scroll-lock behavior:

- **`useChatStreamScroll({ scrollRef, enabled?, lockThreshold?,
buttonThreshold? })`** → `{ isLocked, isScrolledUp, scrollToBottom, lock,
unlock, scrollIfLocked }`. Locked (default) auto-scrolls to bottom as
  content grows; any user scroll-up unlocks immediately; settling back at
  the bottom re-locks. Astryx implements this with a hand-rolled rAF
  spring; var-ui starts with `scrollTo({ behavior: 'smooth' })` for the
  locked case and only reaches for a custom spring if smooth-scroll proves
  janky under real streaming load during implementation.
- **`useChatNewMessages`** — tracks content growth via `ResizeObserver`
  while unlocked, to drive the "New messages ↓" label on `ChatLayout`'s
  default scroll button.

### Icons

Extends the existing `IconName` bundle system
(`packages/core/src/icons/iconNames.ts`, `packages/icons/src/`), which
already earmarked these names for chat in `component-breadth.md` §0.4:

| Name      | Bundle | Used by                                   |
| --------- | ------ | ----------------------------------------- |
| `arrowUp` | 2      | `ChatSendButton` (send)                   |
| `stop`    | 3      | `ChatSendButton` (cancel while streaming) |
| `wrench`  | 3      | `ChatToolCalls` group icon                |
| `clock`   | 2      | `ChatToolCalls` pending status            |

`checkDouble` (delivered/read receipts) is **not** added in v1 — no
component in this scope needs it yet.

## Files touched

- `packages/core/src/icons/iconNames.ts` — currently ships only bundle 1
  (11 names); add `arrowUp`, `stop`, `wrench`, `clock`.
- `packages/icons/src/bundle2.tsx`, `bundle3.tsx`, `index.ts` (bundle2/3 new,
  index.ts modified to merge them into `defaultIcons`) — glyphs for the
  above, following bundle 1's hand-authored SVG pattern
  (`packages/icons/src/bundle1.tsx`, already shipped).
- `packages/core/src/components/chat/*.ts` (new, listed above) +
  `packages/core/src/components/index.ts` (export).
- `packages/react/src/components/chat/*.tsx` (new, listed above) +
  `packages/react/src/chat/use*.ts` (new hooks) +
  `packages/react/src/components/index.ts`, `packages/react/src/index.ts`
  (exports).
- `docs/content/components/chat-*.mdx` (new, one per component, matching
  the existing one-file-per-component docs convention).
- `examples/vite-app/src/App.tsx` (or a dedicated demo section) — a
  simulated token-by-token streaming assistant reply, a tool-call example,
  and the scroll-to-bottom button, exercised across all 8 built-in themes.
- `ROADMAP.md` — add this as its own checklist item (not nested under V6's
  Phase 7, since it's shipping out of order), cross-referencing this spec
  and `component-breadth.md`'s Phase 7 section for the deferred remainder.

## Testing

- Core recipe tests assert registered class names via `getRegisteredCss()`
  (existing pattern — see `card.ts`'s test, `alert.ts`'s test).
- React component tests: sender-based alignment in `ChatMessage`,
  `aria-busy` toggling in `ChatMessageList`, Enter-submits/Shift+Enter-
  newline behavior in `ChatComposerInput`, expand/collapse in
  `ChatToolCalls`, send↔stop swap in `ChatSendButton`, tone rendering in
  `ChatSystemMessage`.
- `useChatStreamScroll`/`useChatNewMessages` get jsdom tests mocking
  `scrollHeight`/`clientHeight`/`ResizeObserver`. Flagged as the one area
  with real testing risk — jsdom's scroll model is limited compared to a
  real browser. Timebox automated coverage; fall back to a documented
  manual QA pass in the example-app demo if a reliable automated test
  isn't practical.
- Example app demo serves as the end-to-end check across all 8 themes
  (satisfies `component-breadth.md`'s existing "Phase 7 done when" bar).

## Out of scope (this spec)

- `ChatComposerDrawer`, mention/token composer input (`useTriggerMenu`,
  `useChatComposerTokens`, `ChatComposerTokenElement`), `ChatDictationButton`
  / `useChatDictation`, `ChatTokenizedText`, `ChatPastedTextToken`,
  `useChatPasteAsToken`.
- `ChatReasoning` — stays lab-tier per `component-breadth.md`'s Lab tier
  section; graduates to core only once a11y/theming/API stability are
  proven, per that spec's graduation rule.
- Markdown rendering — var-ui ships zero markdown parsing; docs show the
  recommended `react-markdown` + `CodeBlock` wiring pattern as an example,
  not a shipped dependency.
- `checkDouble` (read-receipt) icon and any read/delivered status UI.
