'use client';

import { Avatar, ChatMessage, ChatMessageBubble, ChatMessageMetadata } from '@var-ui/react';

export function ChatMessageDemo() {
  return (
    <ChatMessage
      sender="assistant"
      name="Navi"
      avatar={<Avatar name="Navi" size="sm" />}
      metadata={<ChatMessageMetadata date={new Date()} format="time" />}
    >
      <ChatMessageBubble>Hello! How can I help?</ChatMessageBubble>
    </ChatMessage>
  );
}
