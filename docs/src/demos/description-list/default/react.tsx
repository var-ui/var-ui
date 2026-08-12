import { DescriptionList } from '@var-ui/react';

export default function Preview() {
  return (
    <div style={{ width: 280 }}>
      <DescriptionList title="Details">
        <DescriptionList.Item label="Owner">Ada</DescriptionList.Item>
        <DescriptionList.Item label="Status">Active</DescriptionList.Item>
      </DescriptionList>
    </div>
  );
}
