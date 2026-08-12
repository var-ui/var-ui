import { Toc } from '@var-ui/react';

export default function Preview() {
  return (
    <Toc title="On this page">
      <Toc.Item label="Examples" href="#examples" isSelected />
      <Toc.Item label="Default" href="#default" isNested />
      <Toc.Item label="Nested items" href="#nested" isNested />
      <Toc.Item label="Props" href="#props" />
      <Toc.Item label="Accessibility" href="#accessibility" />
    </Toc>
  );
}
