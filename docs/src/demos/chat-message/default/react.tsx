import { Avatar, ChatMessage, ChatMessageBubble, ChatMessageMetadata } from '@var-ui/react';

export default function Preview() {
  return (
    <ChatMessage
      sender="assistant"
      name="Navi"
      avatar={<Avatar name="Navi" size="sm" />}
      metadata={<ChatMessageMetadata date={new Date('2026-07-19T21:35:00.000Z')} format="time" />}
    >
      <ChatMessageBubble>Hello! How can I help?</ChatMessageBubble>
    </ChatMessage>
  );
}
