import { createElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { slugify } from '@/lib/extract-headings';
import { Demo } from './Demo';
import { PropsTable } from './PropsTable';

function getHeadingText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getHeadingText).join('');
  }

  if (children && typeof children === 'object' && 'props' in children) {
    return getHeadingText((children as { props: { children?: ReactNode } }).props.children);
  }

  return '';
}

function createHeadingTag(tag: 'h2' | 'h3') {
  return function MdxHeading({ children, id, ...props }: ComponentPropsWithoutRef<'h2'>) {
    const resolvedId = id ?? slugify(getHeadingText(children));

    return createElement(tag, { ...props, id: resolvedId }, children);
  };
}

export const mdxComponents = {
  Demo,
  PropsTable,
  h2: createHeadingTag('h2'),
  h3: createHeadingTag('h3'),
};
