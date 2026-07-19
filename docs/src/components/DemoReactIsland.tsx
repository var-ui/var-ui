import { createElement, type ComponentType } from 'react';

export default function DemoReactIsland({ Preview }: { Preview: ComponentType }) {
  return createElement(Preview);
}
