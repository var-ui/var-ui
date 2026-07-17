import type { JSX, ReactNode } from 'react';
import { chatMessageBubble } from '@var-ui/core';
import { useChatMessageContext } from './ChatContext';
import { recipeProps } from '../utils';

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
  return <div {...recipeProps(b.root, className)}>{children}</div>;
}
