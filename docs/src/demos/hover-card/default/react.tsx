import { HoverCard, Link } from '@var-ui/react';

export default function Preview() {
  return (
    <HoverCard trigger={<Link href="/u/ada">Ada Lovelace</Link>} title="Ada Lovelace">
      <p>Mathematician and early computing pioneer.</p>
    </HoverCard>
  );
}
