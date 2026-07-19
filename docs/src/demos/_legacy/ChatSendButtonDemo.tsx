'use client';

import { useState } from 'react';
import { ChatSendButton } from '@var-ui/react';

export function ChatSendButtonDemo() {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <ChatSendButton
      isStreaming={isStreaming}
      onPress={() => setIsStreaming(true)}
      onStop={() => setIsStreaming(false)}
    />
  );
}
