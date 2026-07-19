'use client';

import { ChatMessageMetadata } from '@var-ui/react';

export function ChatMessageMetadataDemo() {
  return <ChatMessageMetadata date={new Date()} format="time" status="Read" />;
}
