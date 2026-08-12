import { LoadingOverlay } from '@var-ui/react';

export default function Preview() {
  return (
    <LoadingOverlay visible label="Loading">
      <div style={{ width: 200, height: 80, padding: 16 }}>Content behind overlay</div>
    </LoadingOverlay>
  );
}
