import { useState } from 'react';
import { ChatSendButton } from '@var-ui/react';

export default function Preview() {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <ChatSendButton
      isStreaming={isStreaming}
      onPress={() => setIsStreaming(true)}
      onStop={() => setIsStreaming(false)}
    />
  );
}
