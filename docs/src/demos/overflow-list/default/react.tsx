import { OverflowList } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ width: 180 }}>
      <OverflowList maxVisible={2} renderOverflow={(hidden) => <span>+{hidden.length}</span>}>
        <OverflowList.Item>Alpha</OverflowList.Item>
        <OverflowList.Item>Beta</OverflowList.Item>
        <OverflowList.Item>Gamma</OverflowList.Item>
      </OverflowList>
    </div>
  );
}
