import { Timestamp } from '@var-ui/react';

export default function Preview() {
  return <Timestamp date={new Date(Date.now() - 5 * 60_000)} />;
}
