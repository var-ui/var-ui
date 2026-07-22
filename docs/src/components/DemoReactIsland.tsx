import { createElement } from 'react';
import { reactDemoMap } from '../demos/reactDemoMap';
import type { DemoId } from '../demos/types';

export default function DemoReactIsland({ id }: { id: DemoId }) {
  const Preview = reactDemoMap[id];
  return createElement(Preview);
}
