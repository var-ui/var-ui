import { ChatMessageMetadata } from '@var-ui/react';

export default function Preview() {
  return (
    <ChatMessageMetadata date={new Date('2026-07-19T21:35:00.000Z')} format="time" status="Read" />
  );
}
