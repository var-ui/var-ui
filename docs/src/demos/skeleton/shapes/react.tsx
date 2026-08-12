import { Skeleton } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton shape="circle" style={{ width: 40, height: 40 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton shape="text" style={{ width: 140, height: 14 }} />
        <Skeleton shape="rect" style={{ width: 200, height: 48, borderRadius: 6 }} />
      </div>
    </div>
  );
}
