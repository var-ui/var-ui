import { createElement } from 'react';
import { defaultIcons } from '@var-ui/icons';
import { IconProvider } from '@var-ui/react';
import { reactDemoMap } from '../demos/reactDemoMap';
import type { DemoId } from '../demos/types';

export default function DemoReactIsland({ id }: { id: DemoId }) {
  const Preview = reactDemoMap[id];
  return <IconProvider icons={defaultIcons}>{createElement(Preview)}</IconProvider>;
}
