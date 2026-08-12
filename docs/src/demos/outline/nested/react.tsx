import { Outline } from '@var-ui/react';

export default function Preview() {
  return (
    <Outline
      activeId="examples"
      scrollSpy={false}
      items={[
        { id: 'intro', text: 'Intro', level: 2 },
        { id: 'examples', text: 'Examples', level: 2 },
        { id: 'default', text: 'Default', level: 3 },
        { id: 'nested', text: 'Nested', level: 3 },
        { id: 'props', text: 'Props', level: 2 },
      ]}
    />
  );
}
