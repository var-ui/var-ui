import { LoadingOverlay } from '@var-ui/react';

export default function Preview() {
  return (
    <LoadingOverlay visible label="Saving changes">
      <div
        style={{
          width: 280,
          minHeight: 120,
          padding: 16,
          border: '1px solid var(--var-ui-color-border-subtle)',
          borderRadius: 8,
        }}
      >
        <strong>Account settings</strong>
        <p style={{ margin: '8px 0 0' }}>Display name, email, and notification preferences.</p>
      </div>
    </LoadingOverlay>
  );
}
