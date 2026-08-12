import { Outline } from '@var-ui/react';

export default function Preview() {
  return (
    <Outline
      activeId="intro"
      scrollSpy={false}
      items={[
        { id: 'intro', text: 'Intro', level: 2 },
        { id: 'examples', text: 'Examples', level: 2 },
      ]}
    />
  );
}
