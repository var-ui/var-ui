import { ChatSystemMessage } from '@var-ui/react';

export default function Preview() {
  return (
    <>
      <ChatSystemMessage tone="info">Model switched to GPT-5</ChatSystemMessage>
      <ChatSystemMessage tone="success">Alex joined the conversation</ChatSystemMessage>
    </>
  );
}
