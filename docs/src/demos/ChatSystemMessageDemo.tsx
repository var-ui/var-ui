'use client';

import { ChatSystemMessage } from '@var-ui/react';

export function ChatSystemMessageDemo() {
  return (
    <>
      <ChatSystemMessage tone="info">Model switched to GPT-5</ChatSystemMessage>
      <ChatSystemMessage tone="success">Alex joined the conversation</ChatSystemMessage>
    </>
  );
}
