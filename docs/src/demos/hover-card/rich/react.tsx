import { HoverCard, Link, Text } from '@var-ui/react';

export default function Preview() {
  return (
    <HoverCard
      trigger={<Link href="/u/ada">@ada</Link>}
      title="Ada Lovelace"
      openDelay={400}
      placement="bottom"
    >
      <Text size="sm" tone="secondary">
        Mathematician and early computing pioneer. Worked with Charles Babbage on the Analytical
        Engine.
      </Text>
      <p style={{ marginTop: 8 }}>
        <Link href="/u/ada">View profile</Link>
      </p>
    </HoverCard>
  );
}
