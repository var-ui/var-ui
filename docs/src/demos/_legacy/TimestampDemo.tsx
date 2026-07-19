'use client';

import { Timestamp } from '@var-ui/react';

export function TimestampDemo() {
  return <Timestamp date={new Date(Date.now() - 5 * 60_000)} />;
}
