import { StatusDot } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <StatusDot tone="success" aria-label="Online" /> Online
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <StatusDot tone="warning" aria-label="Away" /> Away
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <StatusDot tone="danger" aria-label="Offline" /> Offline
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <StatusDot tone="info" pulse aria-label="Syncing" /> Syncing
      </span>
    </div>
  );
}
