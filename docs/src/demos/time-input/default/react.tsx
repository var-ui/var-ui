import { Time } from '@internationalized/date';
import { TimeInput } from '@var-ui/react';

export default function Preview() {
  return <TimeInput label="Start" defaultValue={new Time(9, 30)} />;
}
