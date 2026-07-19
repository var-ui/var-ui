'use client';

import { ChatToolCalls } from '@var-ui/react';

export function ChatToolCallsDemo() {
  return (
    <ChatToolCalls
      calls={[
        { name: 'read_file', status: 'complete', target: 'App.tsx', duration: '0.3s' },
        {
          name: 'run_tests',
          status: 'complete',
          resultDetail: <span>42 passed</span>,
        },
      ]}
    />
  );
}
