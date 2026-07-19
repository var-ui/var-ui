'use client';

import { ChatMessage, ChatMessageBubble } from '@var-ui/react';

export function ChatMessageBubbleDemo() {
  return (
    <ChatMessage sender="assistant" name="Navi">
      <ChatMessageBubble group="first">First part of a multi-part reply.</ChatMessageBubble>
      <ChatMessageBubble group="last">Second part.</ChatMessageBubble>
    </ChatMessage>
  );
}
