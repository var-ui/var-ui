import { ScrollArea } from '@var-ui/react';

export default function Preview() {
  return (
    <ScrollArea style={{ height: 120, width: 240 }}>
      <p>Line 1</p>
      <p>Line 2</p>
      <p>Line 3</p>
      <p>Line 4</p>
      <p>Line 5</p>
      <p>Line 6</p>
    </ScrollArea>
  );
}
