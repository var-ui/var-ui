import type { JSX, ReactNode } from 'react';
import { chatMessage } from '@var-ui/core';
import { ChatMessageContext, type ChatSender, useChatListContext } from './ChatContext';
import { recipeProps } from '../utils';

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
      <div {...recipeProps(m.root, className)}>
        {avatar ? <div {...recipeProps(m.avatar)}>{avatar}</div> : null}
        <div {...recipeProps(m.content)}>
          {name ? (
            <div {...recipeProps(m.header)}>
              <span {...recipeProps(m.name)}>{name}</span>
            </div>
          ) : null}
          {children}
          {metadata ? <div {...recipeProps(m.metadata)}>{metadata}</div> : null}
        </div>
      </div>
    </ChatMessageContext.Provider>
  );
}
