import { Timeline } from '@var-ui/react';

export default function Preview() {
  return (
    <Timeline activeIndex={1} tone="accent">
      <Timeline.Item
        title="Created"
        timestamp="2 hours ago"
        description="Issue opened"
        icon="check"
      />
      <Timeline.Item
        title="In review"
        timestamp="1 hour ago"
        description="Waiting on approval"
        icon="clock"
      />
      <Timeline.Item
        title="Merged"
        timestamp="Just now"
        description="PR #42"
        tone="success"
        icon="success"
      />
    </Timeline>
  );
}
