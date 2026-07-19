'use client';

import { ChatMessage, ChatMessageBubble, ChatMessageList } from '@var-ui/react';

export function ChatMessageListDemo() {
  return (
    <ChatMessageList>
      <ChatMessage sender="assistant">
        <ChatMessageBubble>Hello! How can I help?</ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble>What components ship in var-ui?</ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
